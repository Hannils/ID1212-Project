import { UserRecord } from 'firebase-admin/auth'

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
