import axios from 'axios'
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

interface UpdateResponse {
  username: string
  profilePicture?: string
}

const api = {
  signUp: ({ email, username, password }: SignUpRequest) =>
    axios.post<SignUpResponse>(`${API_URL}/user`, {
      email,
      username,
      password,
    }),

  updateAccount: async ({ username, profilePicture }: UpdateAccount) => {
    return axios.patch<UpdateResponse>(`${API_URL}/user`, {
      username,
      profilePicture
    }, { headers: { Authorization: await auth.currentUser?.getIdToken(false) } })
  },
}

export default api
