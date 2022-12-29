import {
  BaseElement,
  Editor,
  EditorMarks,
  Element as SlateElement,
  Transforms,
} from 'slate'

import { Element, Text } from './EditorTypes'

export function getActiveBlocks(editor: Editor): Array<Element['type']> {
  if (editor.selection === null) return []

  const blocks = [
    ...Editor.nodes(editor, {
      at: Editor.unhangRange(editor, editor.selection),
      match: (n) => Editor.isBlock(editor, n),
    }),
  ].map((block) => block[0]) as Element[]

  return blocks.map((block) => block.type)
}

export const isBlockActive = (editor: Editor, format: Element['type']) => {
  const { selection } = editor
  if (!selection) return false

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n) && n.type === format,
    }),
  )

  return !!match
}

export const isCurrentNodeEmpty = (editor: Editor) => {
  if (editor.selection === null) return false
  const nodeEntry = Editor.node(editor, editor.selection)
  const node = nodeEntry.at(0) as Text

  return node.text === ''
}

export const toggleMark = (editor: Editor, format: keyof EditorMarks) =>
  isMarkActive(editor, format)
    ? Editor.removeMark(editor, format)
    : Editor.addMark(editor, format, true)

const isMarkActive = (editor: Editor, format: keyof EditorMarks) => {
  const marks = Editor.marks(editor)
  return marks !== null && marks[format]
}
