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
    console.log(`room ${room} was created`)
    if (room.startsWith('document-')) {
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

  io.of('/').adapter.on('change', (data) => {
    console.log('Data: ', data)
  })

  io.of('/').adapter.on('join-room', (room, id) => {
    console.log(`socket ${id} has joined room ${room}`)
  })

  io.on('connection', (socket) => {
    const documentId = socket.handshake.query.documentId
    console.log('new connection:  ', documentId)
    console.log('current rooms: ', socket.rooms)
    socket.join('document-' + documentId)
    // ...
  })

  io.listen(Number(process.env.SOCKET_PORT))
}
