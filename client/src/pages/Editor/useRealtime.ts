import { User } from 'firebase/auth'
import { useEffect, useRef, useState } from 'react'
import { BaseRange, Descendant, NodeEntry, Operation, Range } from 'slate'
import { io, Socket } from 'socket.io-client'

import useUser from '../../util/auth'
import { CustomOperation, ExternalCursorOperation } from './EditorTypes'

interface RealtimeProps {
  documentId: number | undefined
  value: Descendant[]
  onExternalChange: (a: Operation[]) => void
  onConnect?: CallableFunction
}

export interface Collaborator extends User {
  cursorPosition?: Range
  color: string
}

interface CollaboratorWithCursor extends User {
  cursorPosition: Range
  color: string
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
  const [people, setPeople] = useState<Collaborator[]>([])

  useEffect(() => {
    if (documentId === undefined) return

    const socket = io('http://localhost:7777', {
      query: { documentId, userId: user?.uid },
    })
    setSocket(socket)

    socket.on('connect', () => {
      console.log(socket.id)
    })

    socket.on('join', (user: Collaborator) => {
      console.log('User has joined', user)
      setPeople((people) => [...people, user])
    })

    socket.on('sync-users', (users: Collaborator[]) => {
      console.log('Sync users', users)
      console.log(users)
      setPeople(users)
    })

    socket.on('left', (user: User) => {
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
    const operations = allOperations.filter(({ remote }) => !remote)

    if (operations.length === 0) return

    socket?.emit('change', operations)
  }

  const cursorDecorator = ([node, path]: NodeEntry): BaseRange[] => {
    const peopleInNode = people.filter(
      (collaborator): collaborator is CollaboratorWithCursor => {
        if (
          collaborator.cursorPosition === null ||
          collaborator.cursorPosition === undefined
        )
          return false
        return Range.includes(collaborator.cursorPosition, path)
      },
    )

    return peopleInNode.map(({ cursorPosition, displayName, color }) => {
      return {
        anchor: cursorPosition.anchor,
        focus: cursorPosition.focus,
        collaborator: { displayName, color },
      }
    })
  }

  return {
    loading,
    content,
    people,
    sendOperations,
    cursorDecorator,
  }
}
