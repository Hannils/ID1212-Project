import {
  BaseEditor,
  BaseSetSelectionOperation,
  NodeOperation,
  Operation,
  TextOperation,
} from 'slate'
import { HistoryEditor } from 'slate-history'
import { ReactEditor } from 'slate-react'

type Leaf = { text: string; bold?: true; italic?: true; collaborator?: string }

type Paragraph = { type: 'paragraph'; children: Leaf[] }
type H1 = { type: 'h1'; children: Leaf[] }
type H2 = { type: 'h2'; children: Leaf[] }
type H3 = { type: 'h3'; children: Leaf[] }
type Ul = { type: 'ul'; children: Leaf[] }
type Ol = { type: 'ol'; children: Leaf[] }
type Li = { type: 'li'; children: Leaf[] }

export type Element = Paragraph | H1 | H2 | H3 | Ul | Ol | Li
export type Text = Leaf

export type Marks = keyof Omit<Text, 'text' | 'collaborator'>

declare module 'slate' {
  interface CustomTypes {
    Editor: BaseEditor & ReactEditor & HistoryEditor
    Element: Element
    Text: Leaf
  }
}

// Stolen from slate react type definitions
export type ExternalCursorOperation = {
  type: 'set_external_selection'
  user: string
} & (
  | {
      properties: null
      newProperties: Range
    }
  | {
      properties: Partial<Range>
      newProperties: Partial<Range>
    }
  | {
      properties: Range
      newProperties: null
    }
)

export type CustomOperation = (Operation | ExternalCursorOperation) & {
  remote?: boolean
}
