import { SaveRounded } from '@mui/icons-material'
import {
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { ChangeEvent, useState } from 'react'

import api from '../../api/api'
import { Document, DocumentPreview } from '../../util/Types'

interface ChangeNameProps extends DialogProps {
  onClose: VoidFunction
  document: Document | DocumentPreview
}

export default function ChangeName(props: ChangeNameProps) {
  const { document, ...dialogProps } = props
  const [newTitle, setNewTitle] = useState(document.title)
  const queryClient = useQueryClient()

  const updateTitleMutation = useMutation({
    mutationFn: () => api.updateDocument(document.id, newTitle),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document'] })
      dialogProps.onClose()
    },
  })
  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Edit Name</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Enter the new name below and press save</Typography>
        <TextField
          value={newTitle}
          onChange={(e: ChangeEvent<HTMLInputElement>) => setNewTitle(e.target.value)}
          label="Name"
          placeholder="My document"
          fullWidth
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dialogProps.onClose()}>Cancel</Button>
        <Button
          onClick={() => updateTitleMutation.mutate()}
          startIcon={
            updateTitleMutation.isLoading ? (
              <CircularProgress size={18} />
            ) : (
              <SaveRounded />
            )
          }
        >
          Update
        </Button>
      </DialogActions>
    </Dialog>
  )
}
