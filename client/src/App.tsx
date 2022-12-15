import { useState } from 'react'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout from './components/Layout'
import Home from './pages/Home/Home'

import { Button } from '@mui/material'
import Signup from './pages/Signup/Signup'
import SignIn from './pages/SignIn/SignIn'
import Editor from './pages/Editor/Editor'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Home />} />
          <Route path="/signin" element={<SignIn />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/document/:id" element={<Editor />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App
