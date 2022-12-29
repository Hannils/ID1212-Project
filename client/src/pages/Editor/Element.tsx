import { styled, Typography } from '@mui/material'
import React from 'react'
import { RenderElementProps } from 'slate-react'

const Paragraph = styled(Typography)({
  marginBottom: '1em',
})

interface ElementProps {
  children: any
}

export default function Element({ element, children }: RenderElementProps) {
  switch (element.type) {
    case 'paragraph':
      return <Paragraph>{children}</Paragraph>
    case 'h1':
      return (
        <Typography variant="h1" gutterBottom>
          {children}
        </Typography>
      )
    case 'h2':
      return (
        <Typography variant="h2" gutterBottom>
          {children}
        </Typography>
      )
    case 'h3':
      return (
        <Typography variant="h3" gutterBottom>
          {children}
        </Typography>
      )
    case 'ul':
      return <ul>{children}</ul>
    case 'ol':
      return <ol>{children}</ol>
    case 'li':
      return <li>{children}</li>
    default:
      return <Paragraph>{children}</Paragraph>
  }
}
