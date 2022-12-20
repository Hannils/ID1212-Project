import dotenv from 'dotenv'
import cors from 'cors'
import express, { Request, Response } from 'express'
import userRouter from './routers/user'
import documentRouter from './routers/document'
import initFirebase from './api/firebase'

dotenv.config()

const app = express()
initFirebase()
const port = 8888

app.use(express.json())
app.use(cors({ origin: true }))

app.use('/user', userRouter)
app.use('/document', documentRouter)

app.get('/', (req: Request, res: Response) => {
  res.send('Express + TypeScript Server Hej hampus')
})
app.listen(port, () => {
  console.log(`[server]: Server is running at https://localhost:${port}`)
})
