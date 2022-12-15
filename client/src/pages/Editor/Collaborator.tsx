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
import { ModalInterface, User } from '../../util/Types'
import React from 'react'

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
          {collaborators.map((collaborator) => (
            <ListItem dense>
              <ListItemText
                primary={collaborator.username}
                secondary={collaborator.email}
              />
            </ListItem>
          ))}
        </List>
      </DialogContent>
    </Dialog>
  )
}
