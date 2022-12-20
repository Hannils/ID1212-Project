import { EditRounded, PeopleRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  Container,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'

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
          {document.name}

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
