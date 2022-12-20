import { AccountCircle, AccountCircleRounded } from '@mui/icons-material'
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  FormControl,
  Icon,
  InputAdornment,
  InputLabel,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { ChangeEvent, FormEvent, useEffect, useState } from 'react'
import useUser from '../../util/auth'
import { debounce } from '../../util/helpsers'
import api from "../../api/api";
import { useNavigate } from 'react-router-dom'

interface UpdateAccountFormElement extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    username: HTMLInputElement
    profilePicture: HTMLInputElement
  }
}

export default function Account() {
  const [user] = useUser()
  const [loading, setLoading] = useState<boolean>(false)
  const [photoUrlPreview, setPhotoUrlPreview] = useState<string>(user?.photoURL || '')
  const [photoUrlPreviewStatus, setPhotoUrlPreviewStatus] = useState<string>('')
  const navigate = useNavigate()

  useEffect(() => {
    setPhotoUrlPreviewStatus('')
    debounce(() => {
      setPhotoUrlPreviewStatus('loading')
      if (!photoUrlPreview.startsWith('https://')) return setPhotoUrlPreviewStatus('')
      fetch(photoUrlPreview).then(({ ok }) => setPhotoUrlPreviewStatus(ok ? 'valid' : ''))
    })()
  }, [photoUrlPreview])

  const updateAccount = (e: UpdateAccountFormElement) => {
    e.preventDefault()
    setLoading(true)
    const username = e.target.username.value
    const profilePicture = e.target.profilePicture.value

    api
      .updateAccount({ username, profilePicture })
      .then(() => navigate('/'))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }

  if (user === null) return null

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" textAlign="center" gutterBottom>
        Manage account
      </Typography>
      <List>
        <ListItem divider>
          <ListItemText
            primary="Email"
            secondary={`${user.email} ${
              user.emailVerified ? '(verified)' : '(not verified)'
            }`}
          />
        </ListItem>
        <ListItem divider>
          <ListItemText primary="Username" secondary={user.displayName} />
        </ListItem>
        <ListItem>
          {user.photoURL && (
            <ListItemIcon>
              <Avatar src={user.photoURL} />
            </ListItemIcon>
          )}
          <ListItemText
            primary="Profile image"
            secondary={user.photoURL || 'No image specified'}
          />
        </ListItem>
      </List>
      <Typography variant="h2" gutterBottom>
        Update your account
      </Typography>
      <Box component="form" onSubmit={updateAccount}>
        <Stack spacing={2} mt={3}>
          <TextField
            disabled={loading}
            name="username"
            label="Username"
            defaultValue={user.displayName}
            required
            variant="outlined"
          />
          <TextField
            disabled={loading}
            name="profilePicture"
            label="Profile Picture"
            value={photoUrlPreview}
            placeholder="http://example.com/image.jpg"
            onChange={(e: ChangeEvent<HTMLInputElement>) =>
              setPhotoUrlPreview(e.target.value)
            }
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  {photoUrlPreviewStatus === 'loading' ? (
                    <CircularProgress size={18} />
                  ) : photoUrlPreviewStatus === 'valid' ? (
                    <Avatar sx={{ width: 24, height: 24 }} src={photoUrlPreview} />
                  ) : (
                    <AccountCircle />
                  )}
                </InputAdornment>
              ),
            }}
            defaultValue={user.photoURL}
            variant="outlined"
          />
          <Button disabled={loading} type="submit" variant="contained">
            {loading ? 'Updating account...' : 'Update'}
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}
