import { EditRounded, PeopleRounded } from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Container,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import api from '../../api/api'
import { DocumentResponse, ErrorResponse } from '../../util/Types'
import ChangeName from './ChangeName'
import Collaborator from './Collaborator'

const document = {
  name: 'Document 1',
  id: 'id1',
  modified: new Date(),
}

const dateTime = Intl.DateTimeFormat('sv-SE', {
  dateStyle: 'long',
  timeStyle: 'short',
})

export default function Editor() {
  const [showCollaboratorModal, setShowCollaboratorModal] = useState<boolean>(false)
  const [showChangeNameModal, setShowChangeNameModal] = useState<boolean>(false)
  const { id } = useParams()
  const [document, setDocument] = useState<
    DocumentResponse | ErrorResponse | undefined | null
  >(undefined)

  useEffect(() => {
    if (id === undefined) return
    api
      .getDocument({ id })
      .then((res) => setDocument(res.data))
      .catch((e) => setDocument({ type: 'error', message: e.message }))
  }, [setDocument])

  if (document === undefined) {
    return (
      <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}>
        <CircularProgress />
      </Box>
    )
  }

  if (document === null) {
    return (
      <Alert severity="error">
        <AlertTitle>Not found!</AlertTitle>
        The document was not found or you are not an owner or collaborator of this
        document
      </Alert>
    )
  }

  if (document.type === 'error') {
    return (
      <Alert severity="error">
        <AlertTitle>Oh no!</AlertTitle>
        There was an error: {document.message}
      </Alert>
    )
  }

  return (
    <Box>
      <Collaborator
        open={showCollaboratorModal}
        onClose={() => setShowCollaboratorModal(false)}
      />
      <ChangeName
        open={showChangeNameModal}
        onClose={() => setShowChangeNameModal(false)}
      />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3" component="h1">
          {document.title}

          <Typography>{dateTime.format(document.modified)}</Typography>
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            size="small"
            startIcon={<PeopleRounded />}
            variant="contained"
            onClick={() => setShowCollaboratorModal(true)}
          >
            Collaborators
          </Button>
          <Button
            size="small"
            startIcon={<EditRounded />}
            variant="contained"
            onClick={() => setShowChangeNameModal(true)}
          >
            Change name
          </Button>
        </Stack>
      </Stack>
    </Box>
  )
}
