import { AddRounded, EditRounded, PersonOffRounded } from '@mui/icons-material'
import DeleteIcon from '@mui/icons-material/Delete'
import {
  Alert,
  AlertTitle,
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
  Skeleton,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { AxiosError } from 'axios'
import React, { FormEvent, Fragment, useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'

import api from '../../api/api'
import { Document, DocumentPreview } from '../../util/Types'
import ChangeName from '../Editor/ChangeName'
import DeleteDocument from '../Editor/DeleteDocument'
import CreateDocument from './CreateDocument'

interface CreateDocumentEvent extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    title: HTMLInputElement
  }
}

export default function Home() {
  const navigate = useNavigate()
  const documentsQuery = useQuery<DocumentPreview[], AxiosError>(
    ['document', 'all'],
    api.getDocuments,
  )
  const sharedQuery = useQuery<DocumentPreview[], AxiosError>(
    ['document', 'shared'],
    api.getShared,
  )

  const createButton = useRef(null)

  const [isCreateOpen, setIsCreateOpen] = useState<boolean>(false)
  const [nameModal, setNameModal] = useState<DocumentPreview | null>(null)
  const [deleteModal, setShowDeleteDocumentModal] = useState<DocumentPreview | null>(null)

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
      {nameModal !== null && (
        <ChangeName open={true} onClose={() => setNameModal(null)} document={nameModal} />
      )}
      {deleteModal !== null && (
        <DeleteDocument
          document={deleteModal}
          open={true}
          onClose={() => setShowDeleteDocumentModal(null)}
        />
      )}
      <Button
        startIcon={<AddRounded />}
        size="large"
        variant="contained"
        ref={createButton}
        onClick={() => setIsCreateOpen(true)}
        sx={{ mb: 5 }}
      >
        Create document
      </Button>
      <CreateDocument
        anchorEl={createButton.current}
        id="create-document-menu"
        open={isCreateOpen}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        onClose={() => setIsCreateOpen(false)}
        onCreate={createDocument}
      />
      <Typography variant="h1">Your documents</Typography>
      {documentsQuery.isLoading ? (
        <List disablePadding>
          {[...new Array(3)].map((_, index) => (
            <ListItem disablePadding key={index}>
              <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
            </ListItem>
          ))}
        </List>
      ) : documentsQuery.isSuccess ? (
        <List disablePadding>
          {documentsQuery.data.map((doc) => (
            <Fragment key={doc.id}>
              <ListItem
                secondaryAction={
                  <>
                    <Tooltip title="Rename">
                      <IconButton
                        edge="end"
                        sx={{ mr: '4px' }}
                        onClick={() => setNameModal(doc)}
                      >
                        <EditRounded />
                      </IconButton>
                    </Tooltip>
                    <Tooltip title="Delete">
                      <IconButton
                        edge="end"
                        onClick={() => setShowDeleteDocumentModal(doc)}
                      >
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
                    secondary={doc.created_at.toLocaleDateString('sv-SE')}
                  />
                </ListItemButton>
              </ListItem>
            </Fragment>
          ))}
        </List>
      ) : (
        documentsQuery.isError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {documentsQuery.error.message}
          </Alert>
        )
      )}
      <Typography variant="h2">Shared documents</Typography>
      {sharedQuery.isLoading ? (
        <List disablePadding>
          {[...new Array(3)].map((_, index) => (
            <ListItem disablePadding key={index}>
              <ListItemText primary={<Skeleton />} secondary={<Skeleton />} />
            </ListItem>
          ))}
        </List>
      ) : sharedQuery.isSuccess ? (
        <List disablePadding>
          {sharedQuery.data.map((doc) => (
            <Fragment key={doc.id}>
              <ListItem
                secondaryAction={
                  <Tooltip title="Remove me from document">
                    <IconButton
                      edge="end"
                      onClick={() => setShowDeleteDocumentModal(doc)}
                    >
                      <PersonOffRounded />
                    </IconButton>
                  </Tooltip>
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
            </Fragment>
          ))}
        </List>
      ) : (
        sharedQuery.isError && (
          <Alert severity="error">
            <AlertTitle>Error</AlertTitle>
            {sharedQuery.error.message}
          </Alert>
        )
      )}
    </Box>
  )
}
