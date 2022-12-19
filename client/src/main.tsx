import './index.css'

import React from 'react'
import ReactDOM from 'react-dom/client'

import App from './App'
import { ThemeProvider } from '@mui/material'
import theme from './util/theme'
import { AuthProvider } from './util/auth'

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <AuthProvider>
        <App />
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>,
)
