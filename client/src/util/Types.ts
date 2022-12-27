import { User } from 'firebase/auth'

import { Element } from '../pages/Editor/EditorTypes'

export interface ModalInterface {
  open: boolean
  onClose: VoidFunction
}

export interface Document {
  id: number
  title: string
  modified?: Date
  created_at: Date
  owner: User
  content: Element[]
}

export interface DocumentPreview {
  id: number
  title: string
  modified?: Date
  created_at: Date
}

export interface ErrorResponse {
  type: 'error'
  message: string
}
