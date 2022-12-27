import { EditRounded, PeopleRounded } from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Box,
  Button,
  CircularProgress,
  Container,
  FormGroup,
  IconButton,
  Paper,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useMemo, useState } from 'react'
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Transforms,
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react'

import { Document, ErrorResponse } from '../../util/Types'
import ChangeName from './ChangeName'
import Collaborator from './Collaborator'
import Element from './Element'
import Leaf from './Leaf'
import useRealtime from './useRealtime'

const EditorPaper = styled(Paper)({
  marginBlock: '16px',
  padding: '10px',
  minHeight: '100vh !important',
})

const dateTime = Intl.DateTimeFormat('sv-SE', {
  dateStyle: 'long',
  timeStyle: 'short',
})

interface EditorPageProps {
  document: Document
}

export default function EditorPage({ document }: EditorPageProps) {
  const [showCollaboratorModal, setShowCollaboratorModal] = useState<boolean>(false)
  const [showChangeNameModal, setShowChangeNameModal] = useState<boolean>(false)
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [value, setValue] = useState<Descendant[]>([])

  const handleChange = (value: Descendant[]) => {
    setValue(value)
  }

  console.log('value', value)

  const realtime = useRealtime({
    documentId: document.id,
    value,
    onChange: () => null,
    onConnect: (content: Descendant[]) =>
      content.forEach((element) => editor.insertNode(element)),
  })

  return (
    <Box>
      <Collaborator
        document={document}
        open={showCollaboratorModal}
        onClose={() => setShowCollaboratorModal(false)}
      />
      <ChangeName
        document={document}
        open={showChangeNameModal}
        onClose={() => setShowChangeNameModal(false)}
      />
      <Stack direction="row" justifyContent="space-between">
        <Typography variant="h3" component="h1">
          {document.title}
          <Tooltip title="Rename">
            <IconButton size="small" onClick={() => setShowChangeNameModal(true)}>
              <EditRounded sx={{ width: '20px', height: '20px' }} />
            </IconButton>
          </Tooltip>

          <Typography>{dateTime.format(document.modified)}</Typography>
        </Typography>
        <Stack direction="row" spacing={2}>
          <Button
            size="small"
            startIcon={<PeopleRounded />}
            variant="contained"
            onClick={() => setShowCollaboratorModal(true)}
          >
            Collaborators
          </Button>
        </Stack>
      </Stack>
      <Slate editor={editor} value={value} onChange={handleChange}>
        <Container maxWidth="md">
          <Editable
            autoFocus
            spellCheck
            as={EditorPaper}
            placeholder="Write something interesting..."
            renderElement={Element}
            renderLeaf={Leaf}
          />
        </Container>
      </Slate>
    </Box>
  )
}
