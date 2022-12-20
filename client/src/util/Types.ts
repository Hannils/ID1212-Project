export interface ModalInterface {
  open: boolean
  onClose: VoidFunction
}

export interface Document {
  id: string
  name: string
  modified: string
  owner: string
  created_at: string
}

export interface User {
  id: string
  email: string
  username: string
}
