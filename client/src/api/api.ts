import axios from 'axios'

const API_URL: string = 'http://localhost:8888'

interface SignUpRequest {
  email: string
  username: string
  password: string
}

interface SignUpResponse {
    signInToken: string
}

const api = {
  signUp: ({ email, username, password }: SignUpRequest) =>
    axios.post<SignUpResponse>(`${API_URL}/user`, {
      email,
      username,
      password,
    }),
}

export default api
