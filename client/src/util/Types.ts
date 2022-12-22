import { User } from 'firebase/auth'

export interface ModalInterface {
  open: boolean
  onClose: VoidFunction
}

export interface Document {
  id: number
  title: string
  modified?: Date
  created_at: Date
  owner: string
  collaborators: Array<User>
  content: Array<Object>
}

export interface DocumentPreview {
  id: number
  title: string
  modified?: Date
  created_at: Date
  owner: string
}

export interface ErrorResponse {
  type: 'error'
  message: string
}
