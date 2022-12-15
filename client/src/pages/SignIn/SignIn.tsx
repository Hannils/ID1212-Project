import {
  Box,
  Button,
  Container,
  FormGroup,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React from 'react'

export default function SignIn() {
  return (
    <Container maxWidth="sm">
      <Typography variant="h1" textAlign="center" gutterBottom>
        Sign in
      </Typography>
      <Box component="form">
        <Stack spacing={2}>
          <TextField label="Email" required type="email" variant="outlined" />
          <TextField label="Password" required variant="outlined" type="password" />
          <Button type="submit" variant="contained">
            Sign in
          </Button>
        </Stack>
      </Box>
    </Container>
  )
}
