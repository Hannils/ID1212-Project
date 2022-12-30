import { AddRounded, DeleteRounded } from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
  IconButton,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Modal,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQuery } from '@tanstack/react-query'
import { User } from 'firebase/auth'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import api from '../../api/api'
import UserAvatar from '../../components/UserAvatar'
import useUser from '../../util/auth'
import { debounce, isEmail } from '../../util/helpsers'
import { Document } from '../../util/Types'
import CollaboratorModalContent from './CollaboratorModalContent'

interface CollaboratorProps extends DialogProps {
  document: Document
}

export default function CollaboratorModal(props: CollaboratorProps) {
  const { open, onClose, document } = props
  const [user] = useUser()
  const {
    data: collaborators,
    isLoading,
    isError,
    isSuccess,
    isRefetching,
  } = useQuery(
    ['document', document.id, 'collaborators'],
    () => api.getCollaborators(document.id),
    { enabled: open },
  )

  if (user === null) return null

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h4">Collaborators</DialogTitle>
      <DialogContent
        sx={{ minWidth: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        {isLoading ? (
          <Box sx={{ minHeight: '400px', display: 'grid', placeItems: 'center' }}>
            <CircularProgress />
          </Box>
        ) : isError || !isSuccess ? (
          <Alert>
            <AlertTitle>Oh no</AlertTitle> Something went wrong
          </Alert>
        ) : (
          <CollaboratorModalContent
            {...{ document, user, collaborators, isRefetching }}
          />
        )}
      </DialogContent>
    </Dialog>
  )
}
