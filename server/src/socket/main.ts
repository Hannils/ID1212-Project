import dotenv from 'dotenv'
import { createEditor, Operation } from 'slate'
import { Server } from 'socket.io'

import { selectDocument } from '../api/database'
import { useAuth } from '../util/Misc'
import { Element, Room } from '../util/Types'

const rooms = new Map<number, Room>()

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
      const document = await selectDocument(documentId)
      if (document === null) {
        // Handle error
        return
      }

      const editor = createEditor()

      document.content.forEach((element) => editor.insertNode(element))

      console.log(editor.children)

      rooms.set(documentId, {
        content: document.content,
        editor,
      })
      io.to(room).emit('init', document.content)
    }
  })

  io.of('/').adapter.on('join-room', (roomName, id) => {
    if (roomName.startsWith('document-')) {
      console.log(`socket ${id} has joined room ${roomName}`)
      const documentId = Number(roomName.replace('document-', ''))

      const room = rooms.get(documentId)
      if (room === undefined) {
        // Handle error
        return
      }
      io.to(roomName).emit('init', room.content)
    }
  })
  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has left room ${room}`)
  })

  io.of('/').adapter.on('delete-room', (roomName) => {
    if (roomName.startsWith('document-')) {
      console.log(`socket has deleted room ${roomName}`)
      const documentId = Number(roomName.replace('document-', ''))
      rooms.delete(documentId)
    }
  })

  io.on('connection', (socket) => {
    const documentId = Number(socket.handshake.query.documentId)
    console.log('new connection:  ', documentId)
    console.log('current rooms: ', socket.rooms)
    const roomName = 'document-' + documentId
    socket.join(roomName)

    socket.on('change', (operation: Operation) => {
      console.log('Change', operation)

      const room = rooms.get(documentId)

      if(room === undefined) {
        // Handle Error
        return
      }
      room.editor.apply(operation)
      console.log(room.editor.children)
      room.content = room.editor.children
 //

      socket.broadcast.to(roomName).emit('change', operation)
    })
  })

  io.listen(Number(process.env.SOCKET_PORT))
}
