import {
  Box,
  Card,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Typography,
} from '@mui/material'
import React from 'react'

const documents = [
  {
    name: 'Testing 1',
    id: 'id1',
    modified: new Date(),
  },
  {
    name: 'Testing 2',
    id: 'id2',
    modified: new Date(),
  },
  {
    name: 'Testing 3',
    id: 'id3',
    modified: new Date(),
  },
]
const shared = [
  {
    name: 'Testing 4',
    id: 'id4',
    modified: new Date(),
    owner: 'Hampus',
  },
  {
    name: 'Testing 5',
    id: 'id5',
    modified: new Date(),
    owner: 'Hampus',
  },
  {
    name: 'Testing 6',
    id: 'id6',
    modified: new Date(),
    owner: 'Hampus',
  },
]

export default function Home() {
  return (
    <Box>
      <Typography variant="h1">Your documents</Typography>
      <List disablePadding>
        {documents.map((doc) => (
          <ListItem key={doc.id}>
            <ListItemButton>
              <ListItemText
                primary={doc.name}
                secondary={doc.modified.toLocaleDateString('sv-SE')}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Typography variant="h2">Shared documents</Typography>
      <List disablePadding>
        {shared.map((doc) => (
          <ListItem key={doc.id}>
            <ListItemButton>
              <ListItemText
                primary={`${doc.name} by ${doc.owner}`}
                secondary={doc.modified.toLocaleDateString('sv-SE')}
              />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
    </Box>
  )
}
