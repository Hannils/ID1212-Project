import { useEffect, useState } from 'react'
import { Descendant } from 'slate'
import { io, Socket } from 'socket.io-client'

import { Element } from './EditorTypes'

interface RealtimeProps {
  documentId: number | undefined
  value: Descendant[]
  onChange: (a: Descendant[]) => void
  onConnect?: CallableFunction
}

export default function useRealtime({
  documentId,
  value,
  onChange,
  onConnect,
}: RealtimeProps) {
  const [loading, setLoading] = useState<boolean>(true)
  const [content, setContent] = useState<Descendant[]>([])
  const [socket, setSocket] = useState<null | Socket>(null)
  useEffect(() => {
    if (documentId === undefined) return

    const socket = io('http://localhost:7777', { query: { documentId } })
    setSocket(socket)

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('init', (data: string) => {
      const content: Descendant[] = JSON.parse(data)
      console.log('content', content)
      onConnect?.(content)
      setContent(content)
      setLoading(false)
    })

    return () => {
      socket.disconnect()
    }
  }, [documentId])

  useEffect(() => {
    if (socket === null || loading) return

    console.log('Emitting change event', value)

    socket.emit('change', value)
  }, [value, socket, loading])

  return {
    loading,
    content,
  }
}
