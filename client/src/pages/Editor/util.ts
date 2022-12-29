import {
  Editor,
  Transforms,
  Element as SlateElement,
  EditorMarks,
  BaseElement,
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

const isBlockActive = (editor: Editor, format: string) => {
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

export const toggleBlock = (editor: Editor, type: Element['type']) => {
  console.log(type)
  const isActive = isBlockActive(editor, type)

  Transforms.unwrapNodes(editor, {
    match: (n) => !Editor.isEditor(n) && SlateElement.isElement(n),
    split: true,
  })

  Transforms.setNodes(editor, {
    type: isActive ? 'paragraph' : type,
  })

  if (!isActive) {
    const block = { type: type, children: [] }
    Transforms.wrapNodes(editor, block)
  }
}

export const isCurrentNodeEmpty = (editor: Editor) => {
  if (editor.selection === null) return false
  const nodeEntry = Editor.node(editor, editor.selection)
  const node = nodeEntry.at(0) as Text

  return node.text === ''
}

export const toggleMark = (editor: Editor, format: keyof EditorMarks) => {
  const isActive = isMarkActive(editor, format)

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

const isMarkActive = (editor: Editor, format: keyof EditorMarks) => {
  const marks = Editor.marks(editor)
  if (marks === null) return false
  return marks ? marks[format] === true : false
}
