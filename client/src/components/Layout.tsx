import { AccountCircleRounded, LogoutRounded } from '@mui/icons-material'
import {
  AppBar,
  Avatar,
  Box,
  Container,
  Divider,
  IconButton,
  ListItemIcon,
  Menu,
  MenuItem,
  MenuItemProps,
  Stack,
  Typography,
} from '@mui/material'
import { signOut } from 'firebase/auth'
import React, {
  MouseEvent,
  MouseEventHandler,
  ReactElement,
  useMemo,
  useRef,
  useState,
} from 'react'
import { Link, Outlet, useNavigate, useRevalidator } from 'react-router-dom'

import { auth } from '../api/firebase'
import useUser from '../util/auth'
import UserAvatar from './UserAvatar'

interface LayoutProps {
  children?: ReactElement
}

export default function Layout(props: LayoutProps) {
  const { children } = props
  const [user] = useUser()
  const navigate = useNavigate()

  const [isProfileOpen, setIsProfileOpen] = useState<boolean>(false)
  const avatarRef = useRef(null)

  function onClicker(cb?: CallableFunction): React.MouseEventHandler {
    return (e) => {
      setIsProfileOpen(false)
      cb !== undefined && cb(e)
    }
  }

  console.log('user', user)
  return (
    <Box pt={12}>
      <AppBar sx={{ zIndex: 100 }}>
        <Stack
          px={4}
          py={1}
          flexDirection="row"
          justifyContent="space-between"
          alignItems="center"
        >
          <Link to="/">
            <Typography variant="h4" component="span">
              Realtime document editor
            </Typography>
          </Link>
          <IconButton size="small" ref={avatarRef} onClick={() => setIsProfileOpen(true)}>
            {user === null ? (
              <AccountCircleRounded fontSize="large" />
            ) : (
              <UserAvatar user={user} />
            )}
          </IconButton>
        </Stack>
        <Menu
          PaperProps={{
            sx: { maxWidth: 300, width: '75%' },
          }}
          anchorEl={avatarRef.current}
          id="account-menu"
          open={isProfileOpen}
          onClose={() => setIsProfileOpen(false)}
        >
          <MenuItem disabled sx={{ pointerEvents: 'none' }}>
            {user === null
              ? 'Not signed in'
              : `Signed in as ${user.displayName || user.email}`}
          </MenuItem>
          <Divider />
          {user === null ? (
            <MenuItem component={Link} to="/signin" onClick={onClicker()}>
              Sign in
            </MenuItem>
          ) : (
            <MenuItem component={Link} to="/account" onClick={onClicker()}>
              <ListItemIcon>
                <AccountCircleRounded />
              </ListItemIcon>
              Account
            </MenuItem>
          )}
          {user === null ? (
            <MenuItem component={Link} to="/signup" onClick={onClicker()}>
              Create an account
            </MenuItem>
          ) : (
            <MenuItem
              onClick={onClicker(() => signOut(auth).then(() => navigate('/signin')))}
            >
              <ListItemIcon>
                <LogoutRounded fontSize="small" />
              </ListItemIcon>
              Sign out
            </MenuItem>
          )}
        </Menu>
      </AppBar>
      <Container>
        <Outlet />
      </Container>
    </Box>
  )
}
