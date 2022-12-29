import { EditRounded, PeopleRounded } from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Container,
  FormGroup,
  IconButton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import { User } from 'firebase/auth'
import React, { useEffect, useMemo, useState } from 'react'
import { useParams } from 'react-router-dom'
import { Descendant } from 'slate'
import {
  BaseEditor,
  createEditor,
  Element as SlateElement,
  Operation,
  Transforms,
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react'

import api from '../../api/api'
import useUser from '../../util/auth'
import { Document, ErrorResponse } from '../../util/Types'
import EditorPage from './EditorPage'
import useRealtime from './useRealtime'

export default function Editor() {
  const { id } = useParams()

  const [content, setContent] = useState<Descendant[]>([])
  const [people, setPeople] = useState<User[]>([])
  const {
    data: document,
    isLoading,
    isError,
    error,
  } = useQuery<Document, AxiosError>(['document', id], () => api.getDocument(id || ''), {
    enabled: id !== undefined,
  })
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const realtime = useRealtime({
    documentId: Number(id),
    value: content,
    onExternalChange: (operations: Operation[]) =>
      operations.forEach((operation) =>
        editor.apply({ ...operation, remote: true } as unknown as Operation),
      ),
    onConnect: (content: Descendant[]) => setContent(content),
    onJoin: (user: User) => setPeople((people) => [...people, user]),
    onSync: (users: User[]) => setPeople(users),
    onLeave: (user: User) =>
      setPeople((people) => people.filter((person) => person.uid !== user.uid)),
  })

  if (isLoading || realtime.loading) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (isError && error.status === 403) {
    return (
      <Alert severity="error">
        <AlertTitle>No access!</AlertTitle>
        The document was not found or you are not an owner or collaborator of this
        document
      </Alert>
    )
  }

  if (isError) {
    return (
      <Alert severity="error">
        <AlertTitle>Oh no!</AlertTitle>
        There was an error: {error.message}
      </Alert>
    )
  }

  return (
    <EditorPage
      document={document}
      content={content}
      editor={editor}
      onChange={(value, operations) => {
        setContent(value)
        realtime.sendOperations(operations)
      }}
      people={people}
    />
  )
}
