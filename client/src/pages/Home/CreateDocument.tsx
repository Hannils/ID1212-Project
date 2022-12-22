import { Box, Button, TextField, Typography } from '@mui/material'
import Popover, { PopoverProps } from '@mui/material/Popover'
import React, { EventHandler, SyntheticEvent } from 'react'

interface CreateDocumentProps extends PopoverProps {
  onCreate: EventHandler<SyntheticEvent>
}

export default function CreateDocument({ onCreate, ...props }: CreateDocumentProps) {
  return (
    <Popover
      {...props}
      PaperProps={{
        sx: { maxWidth: 300, width: '75%', p: 3 },
      }}
      id="create-document-menu"
    >
      <Box
        component="form"
        sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}
        onSubmit={onCreate}
      >
        <Typography variant="h3">Create new document</Typography>
        <TextField name="title" label="Document title" />
        <Button type="submit" variant="contained">
          Create
        </Button>
      </Box>
    </Popover>
  )
}
