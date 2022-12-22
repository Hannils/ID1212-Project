import { Avatar, AvatarProps } from '@mui/material'
import { User } from 'firebase/auth'
import React, { useMemo } from 'react'

interface UserAvatarProps extends AvatarProps {
  user: User
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
  const initials = useMemo<string>(
    () =>
      user === null || user.displayName === null ? '' : getInitials(user.displayName),
    [user],
  )

  return (
    <Avatar src={user.photoURL ? user.photoURL : undefined}>
      {user.photoURL ? undefined : initials}
    </Avatar>
  )
}

function getInitials(name: string): string {
  const rgx = new RegExp(/(\p{L}{1})\p{L}+/, 'gu')
  const initials = [...name.matchAll(rgx)] || []

  return ((initials.shift()?.[1] || '') + (initials.pop()?.[1] || '')).toUpperCase()
}
