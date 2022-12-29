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
import { Editor, EditorMarks, Text, Element as SlateElement } from 'slate'
import { Element } from './EditorTypes'
import { useSlate } from 'slate-react'

import { getActiveBlocks, isCurrentNodeEmpty, toggleBlock, toggleMark } from './util'

const HEADING_LABELS = {
  h1: 'Header 1',
  h2: 'Header 2',
  h3: 'Header 3',
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

  const updateMarks = (
    e: React.MouseEvent<HTMLElement, MouseEvent>,
    newMarks: Array<keyof Omit<Text, 'text'>>,
  ) => {
    const currentMarks = Object.keys(marks) as Array<keyof Omit<Text, 'text'>>

    let [mark] = currentMarks
      .filter((x) => !newMarks.includes(x))
      .concat(newMarks.filter((x) => !currentMarks.includes(x)))
    toggleMark(editor, mark)
    const newMarksObj: Omit<Text, 'text'> = {}
    newMarks.forEach((mark) => (newMarksObj[mark] = true))
    setMarks(newMarksObj)
  }

  const updateBlock = useCallback(
    (newBlock: Element['type']) => {
      toggleBlock(editor, newBlock)
      setActiveBlocks([])
    },
    [editor],
  )

  return (
    <AppBar color="inherit" elevation={0} position="sticky" sx={{ top: '80px' }}>
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
          value={marks}
          onChange={(e, value) =>
            updateMarks(e, value as Array<keyof Omit<Text, 'text'>>)
          }
        >
          <ToggleButton aria-label="bold" value="bold">
            <FormatBoldIcon />
          </ToggleButton>
          <ToggleButton aria-label="italic" value="italic">
            <FormatItalicIcon />
          </ToggleButton>
          <ToggleButton aria-label="underlined" value="underline">
            <FormatUnderlinedIcon />
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
          <ToggleButton aria-label="bold" value="paragraph">
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
