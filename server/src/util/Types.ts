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
  owner: string
  collaborators: Array<UserRecord>
  content: Array<Object>
}

export interface DocumentPreview {
  id: number
  title: string
  modified?: Date
  created_at: Date
  owner: string
}
