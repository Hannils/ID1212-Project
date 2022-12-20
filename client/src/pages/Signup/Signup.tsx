import {
  Box,
  Button,
  Container,
  FormGroup,
  Link,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import { signInWithCustomToken } from 'firebase/auth'
import React, { FormEvent, useState } from 'react'
import { Link as RouterLink, useNavigate } from 'react-router-dom'

import api from '../../api/api'
import { auth } from '../../api/firebase'

interface SignUpFormElement extends FormEvent<HTMLFormElement> {
  target: EventTarget & {
    username: HTMLInputElement
    email: HTMLInputElement
    password: HTMLInputElement
  }
}

export default function Signup() {
  const [loading, setLoading] = useState<boolean>(false)
  const navigate = useNavigate()

  const signUp = (e: SignUpFormElement) => {
    e.preventDefault()
    setLoading(true)
    const email = e.target.email.value
    const username = e.target.username.value
    const password = e.target.password.value

    api
      .signUp({ email, username, password })
      .then((res) => signInWithCustomToken(auth, res.data.signInToken))
      .then(() => navigate('/'))
      .catch((error) => console.error(error))
      .finally(() => setLoading(false))
  }
  return (
    <Container maxWidth="sm">
      <Typography variant="h1" textAlign="center" gutterBottom>
        Sign up
      </Typography>
      <Box component="form" onSubmit={signUp}>
        <Stack spacing={2}>
          <TextField name="username" label="Username" required variant="outlined" />
          <TextField
            disabled={loading}
            name="email"
            label="Email"
            required
            type="email"
            variant="outlined"
          />
          <TextField
            disabled={loading}
            name="password"
            label="Password"
            required
            variant="outlined"
            type="password"
          />
          <Button type="submit" variant="contained" disabled={loading}>
            {loading ? 'Creating account... ' : 'Sign up'}
          </Button>
          <Typography>
            Aleady have an account?{' '}
            <Link component={RouterLink} to="/signin">
              Sign in
            </Link>
          </Typography>
        </Stack>
      </Box>
    </Container>
  )
}
