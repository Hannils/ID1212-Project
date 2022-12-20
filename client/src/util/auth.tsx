import { User } from 'firebase/auth'
import { createContext, useContext, useEffect, useState } from 'react'

import { auth } from '../api/firebase'

const authContext = createContext<[User | null, boolean]>([null, true])
const useUser = () => useContext(authContext)
const Provider = authContext.Provider

export const AuthProvider = (props: any) => {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState<boolean>(true)

  useEffect(() => {
    return auth.onAuthStateChanged((user) => {
      setUser(user)
      setLoading(false)
    })
  }, [])

  return <Provider {...props} value={[user, loading]} />
}

export default useUser
