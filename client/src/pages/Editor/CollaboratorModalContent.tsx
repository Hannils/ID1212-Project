import { AddRounded, DeleteRounded } from '@mui/icons-material'
import {
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
  Skeleton,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import { useQueryClient } from '@tanstack/react-query'
import { User } from 'firebase/auth'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'

import api from '../../api/api'
import UserAvatar from '../../components/UserAvatar'
import useUser from '../../util/auth'
import { debounce, isEmail } from '../../util/helpsers'
import { Document } from '../../util/Types'

interface CollaboratorModaContentlProps {
  document: Document
  collaborators: User[]
  user: User
  isRefetching: boolean
}

export default function CollaboratorModalContent(props: CollaboratorModaContentlProps) {
  const { document, collaborators, user, isRefetching } = props

  const queryClient = useQueryClient()

  const [searchUser, setSearchUser] = useState<undefined | null | User>(null)
  const [searchValue, setSearchValue] = useState<string>('')

  const addCollaborator = () => {
    if (!searchUser) return

    api.addCollaborator(searchUser.uid, document.id).then(() =>
      queryClient.invalidateQueries({
        queryKey: ['document', document.id, 'collaborators'],
      }),
    )
  }

  const removeCollaborator = (userId: string) => {
    api.removeCollaborator(userId, document.id).then(() =>
      queryClient.invalidateQueries({
        queryKey: ['document', document.id, 'collaborators'],
      }),
    )
  }

  useEffect(() => {
    if (!isEmail(searchValue)) return
    setSearchUser(undefined)

    debounce((email: string) =>
      api.getUser({ email }).then((res) => setSearchUser(res.data)),
    )(searchValue)
  }, [searchValue])

  if (user === null) return null

  return (
    <>
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
            <ListItemAvatar>
              <UserAvatar user={document.owner} />
            </ListItemAvatar>
            <ListItemText
              primary={document.owner.displayName + ' (owner)'}
              secondary={document.owner.email}
            />
          </ListItem>
          {collaborators.length > 0 && <Divider />}
          {collaborators.map((collaborator) => (
            <ListItem
              key={collaborator.email}
              dense
              secondaryAction={
                user.uid === document.owner.uid && (
                  <IconButton onClick={() => removeCollaborator(collaborator.uid)}>
                    <DeleteRounded />
                  </IconButton>
                )
              }
            >
              <ListItemAvatar>
                <UserAvatar user={collaborator} isLoading={isRefetching} />
              </ListItemAvatar>
              <ListItemText
                primary={
                  isRefetching ? <Skeleton width="80%" /> : collaborator.displayName
                }
                secondary={isRefetching ? <Skeleton width="40%" /> : collaborator.email}
              />
            </ListItem>
          ))}
        </List>
      </Box>
    </>
  )
}
