import { Button } from '@mui/material'
import { useState } from 'react'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

import Layout from './components/Layout'
import WithAuth from './components/WithAuth'
import Account from './pages/Account/Account'
import Editor from './pages/Editor/Editor'
import Home from './pages/Home/Home'
import SignIn from './pages/SignIn/SignIn'
import Signup from './pages/Signup/Signup'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<WithAuth Page={Home} />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/account" element={<WithAuth Page={Account} />} />
          <Route path="/document/:id" element={<WithAuth Page={Editor} />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
