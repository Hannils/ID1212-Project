import { FunctionComponent } from 'react'
import { Navigate } from 'react-router-dom'

import useUser from '../util/auth'

interface WithAuthInterface {
  Page: FunctionComponent
}

function WithAuth({ Page }: WithAuthInterface) {
  const [user] = useUser()
  if (user === null) return <Navigate to="/signin" />

  return <Page />
}

export default WithAuth
