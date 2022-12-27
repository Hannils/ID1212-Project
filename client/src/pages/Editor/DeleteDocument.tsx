import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogProps,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import React, { EventHandler, SyntheticEvent } from 'react'

import api from '../../api/api'
import { Document, DocumentPreview } from '../../util/Types'

interface DeleteDocumentProps extends DialogProps {
  onClose: VoidFunction
  document: Document | DocumentPreview
}

export default function DeleteDocument(props: DeleteDocumentProps) {
  const { document, ...dialogProps } = props

  const queryClient = useQueryClient()

  const deleteDocumentMutation = useMutation({
    mutationFn: () => api.deleteDocument(document.id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['document'] })
      dialogProps.onClose()
    },
  })
  return (
    <Dialog {...dialogProps}>
      <DialogTitle>Confirm the action</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Do you want to delete {document.title}</Typography>
      </DialogContent>
      <DialogActions>
        <Button onClick={() => dialogProps.onClose()}>Cancel</Button>
        <Button
          onClick={() => deleteDocumentMutation.mutate()}
          color="warning"
          variant="contained"
        >
          Confirm
        </Button>
      </DialogActions>
    </Dialog>
  )
}
