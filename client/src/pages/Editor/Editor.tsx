import {
  Box,
  Button,
  Container,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'

const document = {
  name: 'Document 1',
  id: 'id1',
  modified: new Date(),
}

export default function Editor() {
  return (
    <Box>
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3" component="h1">
          {document.name}
        </Typography>
        <Box>
          <Button>Collaborators</Button>
          <Typography>{document.modified.toLocaleDateString('sv-SE')}</Typography>
        </Box>
      </Stack>
    </Box>
  )
}
