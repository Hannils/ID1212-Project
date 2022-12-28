import dotenv from 'dotenv'
import { Server } from 'socket.io'

import { selectDocument } from '../api/database'
import { useAuth } from '../util/Misc'
import { Element } from '../util/Types'

const contents = new Map<number, Element[]>()

export default function initSocket() {
  const io = new Server({
    cors: {
      origin: ['http://localhost:5173'],
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

      contents.set(documentId, document.content)
      io.to(room).emit('init', document.content)
    }
  })

  io.of('/').adapter.on('join-room', (room, id) => {
    if (room.startsWith('document-')) {
      console.log(`socket ${id} has joined room ${room}`)
      const documentId = Number(room.replace('document-', ''))

      const content = contents.get(documentId)
      io.to(room).emit('init', content)
    }
  })
  io.of('/').adapter.on('leave-room', (room, id) => {
    console.log(`socket ${id} has left room ${room}`)
  })

  io.of('/').adapter.on('delete-room', (room) => {
    if (room.startsWith('document-')) {
      console.log(`socket has deleted room ${room}`)
      const documentId = Number(room.replace('document-', ''))
      contents.delete(documentId)
    }
  })

  io.on('connection', (socket) => {
    const documentId = Number(socket.handshake.query.documentId)
    console.log('new connection:  ', documentId)
    console.log('current rooms: ', socket.rooms)
    const room = 'document-' + documentId
    socket.join('document-' + documentId)

    socket.on('change', (data: any) => {

      console.log("Change", data)

      /* contents.set(documentId, data) */

      socket.broadcast.to(room).emit('change', data)
    })
  })

  io.listen(Number(process.env.SOCKET_PORT))
}
