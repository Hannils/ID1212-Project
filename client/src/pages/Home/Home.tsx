import {
  Box,
  Button,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Popover,
  TextField,
  Typography,
} from '@mui/material'
import React, { FormEvent, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/api'

const documents = [
  {
    name: 'Testing 1',
    id: 'id1',
    modified: new Date(),
  },
  {
    name: 'Testing 2',
    id: 'id2',
    modified: new Date(),
  },
  {
    name: 'Testing 3',
    id: 'id3',
    modified: new Date(),
  },
]
const shared = [
  {
    name: 'Testing 4',
    id: 'id4',
    modified: new Date(),
    owner: 'Hampus',
  },
  {
    name: 'Testing 5',
    id: 'id5',
    modified: new Date(),
    owner: 'Hampus',
  },
  {
    name: 'Testing 6',
    id: 'id6',
    modified: new Date(),
    owner: 'Hampus',
  },
]

interface CreateDocumentEvent extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    title: HTMLInputElement
  }
}

export default function Home() {
  const navigate = useNavigate()
  const createButton = useRef(null)
  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)

  const createDocument = (e: CreateDocumentEvent) => {
    e.preventDefault()
    api
      .createDocument({ title: e.target.title.value })
      .then((res) => navigate('/document/' + res.data.documentId))
  }
  return (
    <Box>
      <Button size="small" ref={createButton} onClick={() => setIsCreateOpen(true)}>
        Create document
      </Button>
      <Popover
        PaperProps={{
          sx: { maxWidth: 300, width: '75%', p: 3 },
        }}
        anchorEl={createButton.current}
        id="create-document-menu"
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
      >
        <Box
          component="form"
          sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
          onSubmit={createDocument}
        >
          <Typography variant="h3">Create new document</Typography>
          <TextField name="title" />
          <Button type="submit" variant="contained">
            Create
          </Button>
        </Box>
      </Popover>
      <Typography variant="h1">Your documents</Typography>
      <List disablePadding>
        {documents.map((doc) => (
          <ListItem key={doc.id}>
            <ListItemButton>
              <ListItemText
                primary={doc.name}
                secondary={doc.modified.toLocaleDateString('sv-SE')}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Typography variant="h2">Shared documents</Typography>
      <List disablePadding>
        {shared.map((doc) => (
          <ListItem key={doc.id}>
            <ListItemButton>
              <ListItemText
                primary={`${doc.name} by ${doc.owner}`}
                secondary={doc.modified.toLocaleDateString('sv-SE')}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
