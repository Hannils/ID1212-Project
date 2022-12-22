import { AddRounded } from '@mui/icons-material'
import {
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogContent,
  DialogProps,
  DialogTitle,
  Divider,
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
import { User } from 'firebase/auth'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import api from '../../api/api'
import UserAvatar from '../../components/UserAvatar'
import useUser from '../../util/auth'
import { debounce, isEmail } from '../../util/helpsers'
import { Document } from '../../util/Types'

interface CollaboratorProps extends DialogProps {
  document: Document
}

export default function Collaborator(props: CollaboratorProps) {
  const { open, onClose, document } = props
  const [user] = useUser()
  const [searchUser, setSearchUser] = useState<undefined | null | User>(null)
  const [searchValue, setSearchValue] = useState<string>('')

  const addCollaborator = () => {
    if (!searchUser) return

    api.addCollaborator({ userId: searchUser.uid, documentId: document.id })
  }

  useEffect(() => {
    if (!isEmail(searchValue)) return
    setSearchUser(undefined)

    debounce((email: string) =>
      api.getUser({ email }).then((res) => setSearchUser(res.data)),
    )(searchValue)
  }, [searchValue])

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle variant="h4">Collaborators</DialogTitle>
      <DialogContent
        sx={{ minWidth: '400px', display: 'flex', flexDirection: 'column', gap: 2 }}
      >
        <Box>
          <Typography variant="h5">Add people</Typography>
          <TextField
            margin="normal"
            fullWidth
            value={searchValue}
            name="email"
            label="Find users by email"
            placeholder="name@example.com"
            onChange={(e) => setSearchValue(e.target.value)}
          />
          <Stack alignItems="flex-end">
            <Tooltip
              title={searchUser === null && searchValue !== '' ? 'No user found' : ''}
              disableInteractive
            >
              <span>
                <Button
                  onClick={addCollaborator}
                  disabled={!searchUser}
                  startIcon={
                    searchUser === undefined ? (
                      <CircularProgress size={18} />
                    ) : (
                      <AddRounded />
                    )
                  }
                  type="submit"
                  variant="outlined"
                >
                  Add{!searchUser || ` "${searchUser.displayName}" to your document`}
                </Button>
              </span>
            </Tooltip>
          </Stack>
        </Box>
        <Box>
          <Typography variant="h5" gutterBottom>
            People who have access
          </Typography>
          <List>
            <ListItem dense>
              {user === null || (
                <ListItemAvatar>
                  <UserAvatar user={user} />
                </ListItemAvatar>
              )}
              <ListItemText
                primary={user?.displayName + ' (owner)'}
                secondary={user?.email}
              />
            </ListItem>
            {document.collaborators.length > 0 && <Divider />}
            {document.collaborators.map((user) => (
              <ListItem key={user.email} dense>
                <ListItemAvatar>
                  <UserAvatar user={user} />
                </ListItemAvatar>
                <ListItemText primary={user.displayName} secondary={user.email} />
              </ListItem>
            ))}
          </List>
        </Box>
      </DialogContent>
    </Dialog>
  )
}
