import { useEffect, useRef, useState } from 'react'
import { Descendant, Operation } from 'slate'
import { io, Socket } from 'socket.io-client'

import useUser from '../../util/auth'
import { CustomOperation, Element } from './EditorTypes'

interface RealtimeProps {
  documentId: number | undefined
  value: Descendant[]
  onExternalChange: (a: Operation[]) => void
  onConnect?: CallableFunction
  onJoin: CallableFunction
  onSync: CallableFunction
  onLeave: CallableFunction
}

export default function useRealtime({
  documentId,
  value,
  onExternalChange,
  onConnect,
  onJoin,
  onSync,
  onLeave,
}: RealtimeProps) {
  const [user] = useUser()
  const [loading, setLoading] = useState<boolean>(true)
  const [content, setContent] = useState<Descendant[]>([])
  const [socket, setSocket] = useState<null | Socket>(null)

  useEffect(() => {
    if (documentId === undefined) return

    const socket = io('http://localhost:7777', {
      query: { documentId, userId: user?.uid },
    })
    setSocket(socket)

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('join', (user) => {
      console.log('User has joined', user)
      onJoin?.(user)
    })

    socket.on('sync-users', (users) => {
      console.log('Sync users', users)
      onSync(users)
    })

    socket.on('left', (user) => {
      console.log('Someone left', user)
      onLeave(user)
    })

    socket.on('init', (content: Descendant[] | null) => {
      console.log('content', content)
      if (content === null) return
      onConnect?.(content)
      setContent(content)
      setLoading(false)
    })

    socket.on('change', (operations: Operation[]) => {
      console.log('There was an external change: ', operations)
      const customOperations = operations.map(
        (operation) => ({ ...operation, remote: true } satisfies CustomOperation),
      )
      onExternalChange(customOperations)
    })

    return () => {
      socket.disconnect()
    }
  }, [documentId])

  const sendOperations = (allOperations: Array<CustomOperation>) => {
    const operations = allOperations.filter(
      (operation) => operation.type !== 'set_selection' && !operation.remote,
    )
    if (operations.length === 0) return

    socket?.emit('change', operations)
  }

  return {
    loading,
    content,
    sendOperations,
  }
}
