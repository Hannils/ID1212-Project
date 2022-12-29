import { useEffect, useRef, useState } from 'react'
import { BaseRange, Descendant, NodeEntry, Operation, Range } from 'slate'
import { io, Socket } from 'socket.io-client'

import useUser from '../../util/auth'
import { CustomOperation, ExternalCursorOperation } from './EditorTypes'
import { User } from 'firebase/auth'

interface RealtimeProps {
  documentId: number | undefined
  value: Descendant[]
  onExternalChange: (a: Operation[]) => void
  onConnect?: CallableFunction
}

interface Collaborator extends User {
  cursorPosition: Range
}

export default function useRealtime({
  documentId,
  value,
  onExternalChange,
  onConnect,
}: RealtimeProps) {
  const [user] = useUser()
  const [loading, setLoading] = useState<boolean>(true)
  const [content, setContent] = useState<Descendant[]>([])
  const [socket, setSocket] = useState<null | Socket>(null)
  const [people, setPeople] = useState<(User | Collaborator)[]>([])

  useEffect(() => {
    if (documentId === undefined) return

    const socket = io('http://localhost:7777', {
      query: { documentId, userId: user?.uid },
    })
    setSocket(socket)

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('join', (user: User) => {
      console.log('User has joined', user)
      setPeople((people) => [...people, user])
    })

    socket.on('sync-users', (users: User[]) => {
      console.log('Sync users', users)
      setPeople(users)
    })

    socket.on('left', (user) => {
      console.log('Someone left', user)
      setPeople((people) => people.filter((person) => person.uid !== user.uid))
    })

    socket.on('init', (content: Descendant[] | null) => {
      console.log('content', content)
      if (content === null) return
      onConnect?.(content)
      setContent(content)
      setLoading(false)
    })

    socket.on('change', (operations: Operation[]) => {
      const [customOperations, cursorOperations] = operations
        .map((operation) => ({ ...operation, remote: true } as CustomOperation))
        .reduce(
          ([operations, externalCursorOperations], operation) =>
            operation.type === 'set_external_selection'
              ? [operations, [...externalCursorOperations, operation]]
              : [[...operations, operation], externalCursorOperations],
          [[], []] as [Operation[], ExternalCursorOperation[]],
        )

      if (cursorOperations.length) {
        cursorOperations.forEach(({ user, properties, newProperties }) => {
          console.log('Prop', properties, newProperties)
          setPeople((people) =>
            people.map((person) =>
              person.uid === user
                ? {
                    ...person,
                    cursorPosition: {
                      ...person.cursorPosition,
                      ...newProperties,
                    } as Range,
                  }
                : person,
            ),
          )
        })
      }
      if (customOperations.length) {
        onExternalChange(customOperations)
      }
    })

    return () => {
      socket.disconnect()
    }
  }, [documentId])

  const sendOperations = (allOperations: Array<CustomOperation>) => {
    const operations = allOperations
      .filter(({ remote }) => !remote)
      .map((operation) =>
        operation.type === 'set_selection'
          ? { ...operation, type: 'set_external_selection', user: user?.uid }
          : operation,
      )

    if (operations.length === 0) return

    socket?.emit('change', operations)
  }

  const cursorDecorator = ([node, path]: NodeEntry): BaseRange[] => {
    const peopleInNode = people
      .filter((person): person is Collaborator =>
        Object.keys(person).includes('cursorPosition'),
      )
      .filter((collaborator) => Range.includes(collaborator.cursorPosition, path))

    return peopleInNode.map(({ cursorPosition, displayName }) => ({
      anchor: cursorPosition.anchor,
      focus: cursorPosition.focus,
      collaborator: displayName,
    }))
  }

  return {
    loading,
    content,
    people,
    sendOperations,
    cursorDecorator,
  }
}
