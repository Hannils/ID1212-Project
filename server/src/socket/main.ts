import { Socket } from 'dgram'
import dotenv from 'dotenv'
import { auth } from 'firebase-admin'
import { UserRecord } from 'firebase-admin/auth'
import { createEditor, Editor, Operation } from 'slate'
import { Server } from 'socket.io'

import { selectDocument, updateDocumentContent } from '../api/database'
import { makeRandomColor, useAuth } from '../util/Misc'
import { Collaborator, CustomOperation, Element } from '../util/Types'

const editors = new Map<number, Editor>()
const activeUsers = new Map<number, Collaborator[]>()
//if path !== [0, 0] removing bold gives error (Cannot find descendant at path [0,1], bold with selections doesn't work at all)
export default function initSocket() {
  const io = new Server({
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      credentials: true,
    },
  })
  io.of('/').adapter.on('create-room', async (room: string) => {
    if (room.startsWith('document-')) {
      console.log(`room ${room} was created`)
      const documentId = Number(room.replace('document-', ''))
      activeUsers.set(documentId, [])
      const document = await selectDocument(documentId)
      if (document === null) {
        // Handle error
        return
      }

      const editor = createEditor()

      document.content.forEach((element) => editor.insertNode(element))

      console.log(editor.children)

      editors.set(documentId, editor)
      io.to(room).emit('init', document.content)
    }
  })

  io.of('/').adapter.on('join-room', (roomName, id) => {
    if (roomName.startsWith('document-')) {
      console.log(`socket ${id} has joined room ${roomName}`)
      const documentId = Number(roomName.replace('document-', ''))

      const room = editors.get(documentId)
      if (room === undefined) {
        // Handle error
        return
      }
      io.to(id).emit('init', room.children)
    }
  })

  io.of('/').adapter.on('delete-room', (roomName) => {
    if (roomName.startsWith('document-')) {
      console.log(`socket has deleted room ${roomName}`)
      const documentId = Number(roomName.replace('document-', ''))
      updateDocumentContent(
        documentId,
        JSON.stringify(editors.get(documentId)?.children),
      ).then(() => editors.delete(documentId))
    }
  })

  io.on('connection', (socket) => {
    const documentId = Number(socket.handshake.query.documentId)
    const userId = socket.handshake.query.userId

    if (userId === undefined || Array.isArray(userId) || isNaN(documentId)) return
    const roomName = 'document-' + documentId
    socket.join(roomName)
    auth()
      .getUser(userId)
      .then((user) => {
        const users = activeUsers.get(documentId)
        if (users === undefined) {
          console.error('Error error123321')
          return
        }
        const collaborator: Collaborator = { ...user, color: makeRandomColor() }
        socket.emit('sync-users', users)
        socket.broadcast.to(roomName).emit('join', collaborator)
        users.push(collaborator)
      })

    socket.on('disconnecting', () => {
      console.log('Someone disconnected')
      auth()
        .getUser(userId)
        .then((user) => {
          const users = activeUsers.get(documentId)
          if (users === undefined) {
            console.error('Error 3223')
            return
          }
          activeUsers.set(
            documentId,
            users.filter((person) => person.uid !== userId),
          )
          socket.broadcast.to(roomName).emit('left', user)
        })
    })

    socket.on('change', (operations: CustomOperation[]) => {
      const room = editors.get(documentId)
      if (room === undefined) {
        // Handle Error
        return
      }

      operations.forEach((operation) => room.apply(operation as Operation))

      for (let i = 0; i < operations.length; i++) {
        if (['remove_text', 'insert_text'].includes(operations[i].type)) {
          operations.splice(i + 1, 0, {
            type: 'set_external_selection',
            user: userId,
            properties: room.selection as unknown as Range,
            newProperties: room.selection as unknown as Range,
          })
        }
      }

      socket.broadcast.to(roomName).emit(
        'change',
        operations.map((operation) =>
          operation.type === 'set_selection'
            ? { ...operation, type: 'set_external_selection', user: userId }
            : operation,
        ),
      )
    })
  })

  io.listen(Number(process.env.SOCKET_PORT))
}
