export interface ModalInterface {
  open: boolean
  onClose: VoidFunction
}

export interface DocumentInterface {
  id: string
  title: string
  modified: Date
  owner: string
  created_at: string
}

export interface User {
  id: string
  email: string
  username: string
}

export interface ErrorResponse {
  type: 'error'
  message: string
}

export interface DocumentResponse {
  type: 'document'
  documentId: string
  title: string
  created_at: Date
  owner: string
  modified: Date
  content: string
}
