import cors from 'cors'
import dotenv from 'dotenv'
import express, { Request, Response } from 'express'

import { initDatabase, selectDocuments } from './api/database'
import initFirebase from './api/firebase'
import documentRouter from './routers/document'
import userRouter from './routers/user'
import { useAuth } from './util/Misc'

dotenv.config()

async function init() {
  const app = express()
  initFirebase()
  await initDatabase()

  app.use(express.json())
  app.use(cors({ origin: true }))
  app.use(useAuth)

  app.use('/user', userRouter)
  app.use('/document', documentRouter)

  app.get('/', (req: Request, res: Response) => {
    res.send('Express + TypeScript Server Hej hampus')
  })
  app.listen(process.env.PORT, () => {
    console.log(`[server]: Server is running at https://localhost:${process.env.PORT}`)
  })
}

init()
