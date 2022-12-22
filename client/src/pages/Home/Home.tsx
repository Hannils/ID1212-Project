import { EditRounded } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Box,
  Button,
  Card,
  IconButton,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Popover,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { FormEvent, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/api'
import { Document, DocumentPreview } from '../../util/Types'
import ChangeName from '../Editor/ChangeName'
import DeleteDocument from '../Editor/DeleteDocument'
import CreateDocument from './CreateDocument'

// const documents = [
//   {
//     name: 'Testing 1',
//     id: '11',
//     modified: new Date(),
//   },
//   {
//     name: 'Testing 2',
//     id: 'id2',
//     modified: new Date(),
//   },
//   {
//     name: 'Testing 3',
//     id: 'id3',
//     modified: new Date(),
//   },
// ]
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
  const [showChangeNameModal, setShowChangeNameModal] = useState<boolean>(false)
  const [showDeleteDocumentModal, setShowDeleteDocumentModal] = useState<boolean>(false)
  const [documents, setDocuments] = useState<DocumentPreview[]>([])

  useEffect(() => {
    api.getDocuments().then((res) => setDocuments(res.data))
  }, [setDocuments])

  const createDocument = (e: CreateDocumentEvent) => {
    e.preventDefault()
    api
      .createDocument({ title: e.target.title.value })
      .then((res) => navigate('/document/' + res.data.documentId))
  }

  const openDocument = (id: string | number) => {
    navigate('/document/' + id)
  }
  return (
    <Box>
      <ChangeName
        open={showChangeNameModal}
        onClose={() => setShowChangeNameModal(false)}
      />
      <DeleteDocument
        open={showDeleteDocumentModal}
        onClose={() => setShowDeleteDocumentModal(false)}
      />
      <Button
        size="small"
        variant="contained"
        ref={createButton}
        onClick={() => setIsCreateOpen(true)}
      >
        Create document
      </Button>
      <CreateDocument
        anchorEl={createButton.current}
        id="create-document-menu"
        open={isCreateOpen}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createDocument}
      />
      <Typography variant="h1">Your documents</Typography>
      <List disablePadding>
        {documents.map((doc) => (
          <ListItem
            key={doc.id}
            secondaryAction={
              <>
                <Tooltip title="Rename">
                  <IconButton
                    edge="end"
                    sx={{ mr: '4px' }}
                    onClick={() => setShowChangeNameModal(true)}
                  >
                    <EditRounded />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Delete">
                  <IconButton edge="end" onClick={() => setShowDeleteDocumentModal(true)}>
                    <DeleteIcon />
                  </IconButton>
                </Tooltip>
              </>
            }
            disablePadding
          >
            <ListItemButton onClick={() => openDocument(doc.id)}>
              <ListItemText
                primary={doc.title}
                secondary={new Date().toLocaleDateString('sv-SE')}
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
