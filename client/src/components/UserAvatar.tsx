import { Avatar, AvatarProps, Skeleton } from '@mui/material'
import { User } from 'firebase/auth'
import React, { useMemo } from 'react'

interface UserAvatarProps extends AvatarProps {
  user: User
  isLoading?: boolean
}

export default function UserAvatar({ user, isLoading, ...props }: UserAvatarProps) {
  const initials = useMemo<string>(
    () =>
      user === null || user.displayName === null ? '' : getInitials(user.displayName),
    [user],
  )

  if (isLoading) {
    return (
      <Avatar sx={{ bgcolor: 'transparent' }}>
        <Skeleton variant="circular" animation="wave" width="100%" height="100%" />
      </Avatar>
    )
  }

  return (
    <Avatar src={user.photoURL ? user.photoURL : undefined} {...props}>
      {user.photoURL ? undefined : initials}
    </Avatar>
  )
}

function getInitials(name: string): string {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
  const initials = [...name.matchAll(rgx)] || []

  return ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase()
}
