import { useEffect, useRef, useState } from 'react'
import { Descendant, Operation } from 'slate'
import { io, Socket } from 'socket.io-client'

import { Element } from './EditorTypes'

interface RealtimeProps {
  documentId: number | undefined
  value: Descendant[]
  onExternalChange: (a: Operation[]) => void
  onConnect?: CallableFunction
}

export default function useRealtime({
  documentId,
  value,
  onExternalChange,
  onConnect,
}: RealtimeProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [content, setContent] = useState<Descendant[]>([])
  const [socket, setSocket] = useState<null | Socket>(null)
  const remote = useRef(false)

  useEffect(() => {
    if (documentId === undefined) return

    const socket = io('http://localhost:7777', { query: { documentId } })
    setSocket(socket)

    socket.on('connect', () => {
      console.log(socket.id)
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
      remote.current = true
      onExternalChange(operations)
      remote.current = false
    })

    return () => {
      socket.disconnect()
    }
  }, [documentId])

  const sendOperations = (allOperations: Operation[]) => {
    const operations = allOperations.filter(
      (operation) => operation.type !== 'set_selection' && !operation.remote
    )

    console.log("Change", remote.current)
    if (operations.length === 0 || remote.current === true) return
    socket?.emit('change', operations)
  }

  return {
    loading,
    content,
    sendOperations,
  }
}
