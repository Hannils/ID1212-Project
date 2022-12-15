import { useState } from 'react'

import { Button } from '@mui/material'

function App() {
  const [count, setCount] = useState(0)

  return (
    <div className="App">
      <Button>Hej</Button>
    </div>
  )
}

export default App
