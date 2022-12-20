import axios from 'axios'

import { DocumentResponse } from '../util/Types'
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
  documentId: string
}

interface GetDocument {
  id: string
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
  getDocument: async ({ id }: GetDocument) => {
    return axios.get<DocumentResponse>(`${API_URL}/document/${id}`, {
      ...(await getAuthedHeaders()),
    })
  },
}

export default api
