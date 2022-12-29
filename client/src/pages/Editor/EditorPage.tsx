import { EditRounded, PeopleRounded } from '@mui/icons-material'
import {
  Alert,
  AlertTitle,
  Avatar,
  AvatarGroup,
  Box,
  Button,
  CircularProgress,
  Container,
  FormGroup,
  IconButton,
  List,
  ListItemAvatar,
  ListItemIcon,
  Paper,
  Stack,
  styled,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import zIndex from '@mui/material/styles/zIndex'
import { User, UserProfile } from 'firebase/auth'
import React, { useMemo, useState } from 'react'
import {
  BaseEditor,
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  Operation,
  Transforms,
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react'

import UserAvatar from '../../components/UserAvatar'
import { Document, ErrorResponse } from '../../util/Types'
import ChangeName from './ChangeName'
import Collaborator from './Collaborator'
import { CustomOperation } from './EditorTypes'
import Element from './Element'
import Leaf from './Leaf'
import Toolbar from './Toolbar'
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
  content: Descendant[]
  editor: BaseEditor & ReactEditor & HistoryEditor
  onChange: (value: Descendant[], operations: CustomOperation[]) => void
  people: User[]
}

export default function EditorPage({
  document,
  content,
  editor,
  onChange,
  people,
}: EditorPageProps) {
  const [showCollaboratorModal, setShowCollaboratorModal] = useState<boolean>(false)
  const [showChangeNameModal, setShowChangeNameModal] = useState<boolean>(false)
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
          <AvatarGroup max={2}>
            {people.map((person) => (
              <Tooltip key={person.uid} title={person.displayName}>
                <UserAvatar key={person.uid} user={person} />
              </Tooltip>
            ))}
          </AvatarGroup>
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
      <Slate
        editor={editor}
        value={content}
        onChange={(value) =>
          onChange(value, editor.operations satisfies CustomOperation[])
        }
      >
        <Toolbar />
        <Container maxWidth="md">
          <Editable
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
