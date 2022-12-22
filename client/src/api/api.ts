import axios from 'axios'
import { User } from 'firebase/auth'

import { Document, DocumentPreview } from '../util/Types'
import { auth } from './firebase'

const API_URL = 'http://localhost:8888'

interface SignUpRequest {
  email: string
  username: string
  password: string
}

interface UpdateAccount {
  username: string
  profilePicture?: string
}

interface SignUpResponse {
  signInToken: string
}

interface UpdateUserResponse {
  username: string
  profilePicture?: string
}

interface CreateDocumentResponse {
  documentId: string | number
}

interface DocumentRequest {
  id: string
}

interface GetUserRequest {
  uid?: string
  phoneNumber?: string
  email?: string
}

interface AddCollaboratorRequest {
  userId: string
  documentId: string | number
}

async function getAuthedHeaders() {
  return { headers: { Authorization: await auth.currentUser?.getIdToken(false) } }
}

const api = {
  signUp: ({ email, username, password }: SignUpRequest) =>
    axios.post<SignUpResponse>(`${API_URL}/user`, {
      email,
      username,
      password,
    }),

  updateAccount: async ({ username, profilePicture }: UpdateAccount) => {
    return axios.patch<UpdateUserResponse>(
      `${API_URL}/user`,
      {
        username,
        profilePicture,
      },
      { ...(await getAuthedHeaders()) },
    )
  },
  createDocument: async ({ title }: Partial<Document>) => {
    return axios.post<CreateDocumentResponse>(
      `${API_URL}/document`,
      {
        title,
      },
      { ...(await getAuthedHeaders()) },
    )
  },
  getDocument: async ({ id }: DocumentRequest) => {
    return axios.get<Document | null>(`${API_URL}/document/${id}`, {
      ...(await getAuthedHeaders()),
    })
  },
  getUser: async ({ uid, phoneNumber, email }: GetUserRequest) => {
    return axios.get<User | null>(`${API_URL}/user`, {
      params: { uid, phoneNumber, email },
      ...(await getAuthedHeaders()),
    })
  },
  getDocuments: async () => {
    return axios
      .get<DocumentPreview[]>(`${API_URL}/document/all`, {
        ...(await getAuthedHeaders()),
      })
      .then((res) => res.data)
  },
  getShared: async () => {
    return axios
      .get<DocumentPreview[]>(`${API_URL}/document/shared`, {
        ...(await getAuthedHeaders()),
      })
      .then((res) => res.data)
  },
  deleteDocument: async ({ id }: DocumentRequest) => {
    return (
      axios.delete(`${API_URL}/document/${id}`),
      {
        ...(await getAuthedHeaders()),
      }
    )
  },
  addCollaborator: async ({ userId, documentId }: AddCollaboratorRequest) =>
    axios.post(`${API_URL}/document/${documentId}/collaborator/${userId}`, undefined, {
      ...(await getAuthedHeaders()),
    }),
}

export default api
