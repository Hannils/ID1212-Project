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
  Divider,
  TextField,
  Box,
} from '@mui/material'
import React, { FormEvent, useState } from 'react'
import useUser from '../../util/auth'
import api from '../../api/api'

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

interface FindCollaboratorEvent extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    email: HTMLInputElement
  }
}

export default function Collaborator(props: ModalInterface) {
  const { open, onClose } = props
  const [user] = useUser()
  //const [collaborators, setCollaborators] = useState<User[]>(() => collaborators)


  const findUser = (e: FindCollaboratorEvent) => {
    const email = e.target.email.value
    //api.getUser({ email  }).then(res => setCollaborators(current => [...current, res.data]) )
  }

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Collaborators</DialogTitle>
      <DialogContent sx={{ minWidth: '400px', textAlign: 'center' }}>
        <Box component="form" onSubmit={findUser}>
          <TextField
            name="email"
            sx={{ minWidth: '350px' }}
            label="Add collaborators..."
            placeholder="Search by email"
          />
        </Box>
        <Typography gutterBottom>People who have access</Typography>
        <List>
          <ListItem dense>
            <ListItemText
              primary={user?.displayName + ' (owner)'}
              secondary={user?.email}
            />
          </ListItem>
          <Divider></Divider>
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
