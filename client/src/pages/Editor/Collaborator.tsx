import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  List,
  ListItem,
  ListItemText,
  Modal,
  Typography,
} from '@mui/material'
import React from 'react'

import { ModalInterface, User } from '../../util/Types'

const collaborators: User[] = [
  {
    id: 'id1',
    username: 'Hampus',
    email: 'blablabla@gmail.com',
  },
  {
    id: 'id2',
    username: 'Kalle',
    email: 'etcetcetc@gmail.com',
  },
]

export default function Collaborator(props: ModalInterface) {
  const { open, onClose } = props
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Collaborators</DialogTitle>
      <DialogContent>
        <Typography gutterBottom>Current collaborators</Typography>
        <List>
          {collaborators.map(({ email, username }) => (
            <ListItem key={email} dense>
              <ListItemText primary={username} secondary={email} />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}
