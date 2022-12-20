import { CircularProgress, Box } from '@mui/material'
import { FunctionComponent } from 'react'
import { Navigate } from 'react-router-dom'

import useUser from '../util/auth'

interface WithAuthInterface {
  Page: FunctionComponent
}

function WithAuth({ Page }: WithAuthInterface) {
  const [user, loading] = useUser()
  if (loading) return <Box sx={{ minHeight: '80vh', display: 'grid', placeItems: 'center' }}><CircularProgress /></Box>
  if (user === null) return <Navigate to="/signin" />

  return <Page />
}

export default WithAuth
