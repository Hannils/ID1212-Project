import { UserRecord } from 'firebase-admin/auth'
import { Descendant, Editor, Operation } from 'slate'

export interface User {
  id: string
  username: string
  email: string
}

export interface Document {
  id: number
  title: string
  modified?: Date
  created_at: Date
  owner: UserRecord
  content: Array<Element>
}

export interface DocumentPreview {
  id: number
  title: string
  modified?: Date
  created_at: Date
}

type Leaf = { text: string; bold?: true; italic?: true }

type Paragraph = { type: 'paragraph'; children: Leaf[] }
type H1 = { type: 'h1'; children: Leaf[] }
type Ul = { type: 'ul'; children: Leaf[] }
type Ol = { type: 'ol'; children: Leaf[] }
type Li = { type: 'li'; children: Leaf[] }

export type Element = Paragraph | H1 | Ul | Ol | Li
export type Text = Leaf

// Stolen from slate react type definitions
type ExternalCursorOperation = {
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
