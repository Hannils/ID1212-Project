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
  BaseRange,
  createEditor,
  Descendant,
  Editor,
  Element as SlateElement,
  NodeEntry,
  Operation,
  Path,
  Transforms,
} from 'slate'
import { HistoryEditor, withHistory } from 'slate-history'
import { Editable, ReactEditor, Slate, useSlate, withReact } from 'slate-react'

import UserAvatar from '../../components/UserAvatar'
import { Document, ErrorResponse } from '../../util/Types'
import ChangeName from './ChangeName'
import CollaboratorModal from './CollaboratorModal'
import { CustomOperation } from './EditorTypes'
import Element from './Element'
import Leaf from './Leaf'
import Toolbar from './Toolbar'
import { Collaborator } from './useRealtime'

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
  decorator?: (n: NodeEntry) => BaseRange[]
  people: Collaborator[]
}

export default function EditorPage({
  document,
  content,
  editor,
  onChange,
  decorator,
  people,
}: EditorPageProps) {
  const [showCollaboratorModal, setShowCollaboratorModal] = useState<boolean>(false)
  const [showChangeNameModal, setShowChangeNameModal] = useState<boolean>(false)
  return (
    <Box>
      <CollaboratorModal
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
                <UserAvatar
                  key={person.uid}
                  user={person}
                  sx={{ outline: `2px solid ${person.color}`, outlineOffset: '-2px' }}
                />
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
            decorate={decorator}
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
