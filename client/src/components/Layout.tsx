import { AppBar, Avatar, Box, Container, Stack, Typography } from '@mui/material'
import React, { ReactElement } from 'react'
import { Link, Outlet } from 'react-router-dom'

interface LayoutProps {
  children?: ReactElement
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  return (
    <Box pt={12}>
      <AppBar sx={{ zIndex: 100 }}>
        <Stack
          px={4}
          py={2}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link to="/" >
            <Typography variant="h4" component="span">
              Realtime document editor
            </Typography>
          </Link>
          <Avatar>A</Avatar>
        </Stack>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </Box>
  )
}
