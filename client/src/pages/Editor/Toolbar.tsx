import Collections from '@mui/icons-material/Collections'
import FormatBoldIcon from '@mui/icons-material/FormatBold'
import FormatItalicIcon from '@mui/icons-material/FormatItalic'
import FormatListBulleted from '@mui/icons-material/FormatListBulleted'
import FormatListNumbered from '@mui/icons-material/FormatListNumbered'
import FormatUnderlinedIcon from '@mui/icons-material/FormatUnderlined'
import Link from '@mui/icons-material/Link'
import PlayCircleOutline from '@mui/icons-material/PlayCircleOutline'
import AppBar from '@mui/material/AppBar'
import Stack from '@mui/material/Stack'
import ToggleButton from '@mui/material/ToggleButton'
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup'
import React, { useCallback, useEffect, useState } from 'react'
import {
  Editor,
  EditorMarks,
  Element as SlateElement,
  Node,
  Text,
  Transforms,
} from 'slate'
import { useSlate } from 'slate-react'

import { Element, Marks } from './EditorTypes'
import { getActiveBlocks, isBlockActive, toggleMark } from './util'

const HEADING_LABELS = {
  h1: 'Heading 1',
  h2: 'Heading 2',
  h3: 'Heading 3',
}

export default function Toolbar() {
  const editor = useSlate()
  const { selection } = editor

  const [marks, setMarks] = useState<Omit<Text, 'text'>>({})
  const [activeBlocks, setActiveBlocks] = useState<Array<Element['type']>>([])

  useEffect(() => {
    if (!selection) return

    const marks = Editor.marks(editor)
    if (marks !== null) setMarks(marks)

    setActiveBlocks(getActiveBlocks(editor))
  }, [selection, editor])

  const updateMarks = (newMarks: Marks[]) => {
    const currentMarks = Object.keys(marks) as Marks[]

    const [mark] = currentMarks
      .filter((x) => !newMarks.includes(x))
      .concat(newMarks.filter((x) => !currentMarks.includes(x)))
    toggleMark(editor, mark)
    const newMarksObj: Omit<Text, 'text'> = {}
    newMarks.forEach((mark) => (newMarksObj[mark] = true))
    setMarks(newMarksObj)
  }

  const updateBlock = (newBlock: Element['type']) => {
    Transforms.setNodes<SlateElement>(editor, {
      type: isBlockActive(editor, newBlock) ? 'paragraph' : newBlock,
    })

    setActiveBlocks(getActiveBlocks(editor))
  }

  return (
    <AppBar color="inherit" elevation={0} position="sticky" sx={{ top: '66px' }}>
      <Stack
        direction="row"
        justifyContent="center"
        spacing={2}
        sx={(theme) => ({
          p: 1,
          borderBottom: `1px solid ${theme.palette.primary.main}`,
        })}
      >
        <ToggleButtonGroup
          aria-label="text formatting"
          value={Object.keys(marks)}
          onChange={(_, value) => updateMarks(value as Array<keyof Omit<Text, 'text'>>)}
        >
          <ToggleButton aria-label="bold" value="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton aria-label="italic" value="italic">
            <FormatItalicIcon />
          </ToggleButton>
        </ToggleButtonGroup>

        <ToggleButtonGroup
          exclusive
          aria-label="Typography"
          value={activeBlocks.find((block) =>
            ['paragraph', ...Object.keys(HEADING_LABELS)].includes(block),
          )}
          onChange={(_, newValue) => updateBlock(newValue as Element['type'])}
        >
          <ToggleButton aria-label="Text" value="paragraph">
            Text
          </ToggleButton>
          {Object.entries(HEADING_LABELS).map(([value, label]) => (
            <ToggleButton key={value} value={value}>
              {label}
            </ToggleButton>
          ))}
        </ToggleButtonGroup>
      </Stack>
    </AppBar>
  )
}
