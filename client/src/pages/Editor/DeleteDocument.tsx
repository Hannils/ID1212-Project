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
  import React, { EventHandler, SyntheticEvent } from 'react'
  
  import { ModalInterface } from '../../util/Types'
  
  export default function DeleteDocument(props: ModalInterface) {
    const { open, onClose } = props
    return (
      <Dialog open={open} onClose={onClose}>
        <DialogTitle>Confirm the action</DialogTitle>
        <DialogContent>
          <Typography gutterBottom>Do you want to delete DOCUMENT</Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button onClick={onClose} type="submit" color="warning" variant="contained">Confirm</Button>
        </DialogActions>
      </Dialog>
    )
  }
  