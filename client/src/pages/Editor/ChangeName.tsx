import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
  Typography,
} from '@mui/material'
import { ModalInterface } from '../../util/Types'
import React from 'react'

export default function ChangeName(props: ModalInterface) {
  const { open, onClose } = props
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Name</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Enter the new name below and press save</Typography>
        <TextField autoFocus label="Name" placeholder="My document" fullWidth />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button>Update</Button>
      </DialogActions>
    </Dialog>
  )
}
