import { createTheme } from '@mui/material'
import React from 'react';



const theme = createTheme({
  palette: {
    warning: {
      main: '#e53e3e'
    },
    primary: {
      main: '#283845',
    },
    secondary: {
      main: '#F2D492',
    },
  },
  typography: {
    fontFamily: [
      '-apple-system',
      'BlinkMacSystemFont',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),

    h1: {
      fontSize: 30,
      fontWeight: 700,
    },
    h2: {
      fontSize: 24,
      fontWeight: 700,
    },
    h3: {
      fontSize: 20,
      fontWeight: 700,
    },
    h4: {
      fontSize: 18,
      fontWeight: 700,
    },
    h5: {
      fontSize: 16,
      fontWeight: 700,
    },
    h6: {
      fontSize: 14,
      fontWeight: 700,
    },
    body1: {
      fontSize: 14,
      lineHeight: '24px',
    },
    body2: {
      fontSize: 12,
    },
    button: {
      textTransform: 'none',
      fontWeight: 'bold',
    },
  },
  components: {
    MuiAppBar: {
      styleOverrides: {
        root: {
          backgroundColor: '#ffffff',
          color: 'inherit',
        },
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'hover',
      },
      styleOverrides: {
        root: {
          fontWeight: 'bold',
        },
      },
    },
  },
})

export default theme
