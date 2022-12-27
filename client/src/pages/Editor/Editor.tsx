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
import React, { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'

import api from '../../api/api'
import { Document, ErrorResponse } from '../../util/Types'
import EditorPage from './EditorPage'
import useRealtime from './useRealtime'

export default function Editor() {
  const { id } = useParams()

  const {
    data: document,
    isLoading,
    isError,
    error,
  } = useQuery<Document, AxiosError>(['document', id], () => api.getDocument(id || ''), {
    enabled: id !== undefined,
  })

  if (isLoading) {
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

  return <EditorPage document={document} />
}
