import express from 'express'
import asyncHandler from 'express-async-handler'
import { auth } from 'firebase-admin'

import {
  DatabaseDocument,
  dropCollaborator,
  dropDocument,
  insertCollaborator,
  insertDocument,
  selectCollaborators,
  selectDocument,
  selectDocuments,
  selectShared,
  updateDocument,
} from '../api/database'
import { requireAuth } from '../util/Misc'
import { Document, Element } from '../util/Types'
import collaboratorRouter from './collaborator'

const getDocument: express.RequestHandler = async (req, res) => {
  const document = await selectDocument(req.params.id)
  if (document === null) return res.sendStatus(404)

  const collaborators = await selectCollaborators(document)

  if (
    res.locals.currentUser !== document.owner.uid &&
    !collaborators.some(({ uid }) => uid === res.locals.currentUser)
  )
    return res.sendStatus(403)

  res.json(document)
}

const getAllDocuments: express.RequestHandler = async (req, res) => {
  const documents = await selectDocuments(res.locals.currentUser)
  res.json(documents)
}

const createDocument: express.RequestHandler = async (req, res) => {
  const { title } = req.body
  if (typeof title !== 'string')
    return res.status(400).send('Fields missing in POST /document')

  const document: DatabaseDocument = {
    title,
    created_at: new Date(),
    owner: res.locals.currentUser,
    content: JSON.stringify([
      {
        type: 'paragraph',
        children: [{ text: '' }],
      },
    ] satisfies Element[]),
  }

  const documentId = await insertDocument(document)

  return res.json({ documentId })
}

const patchDocument: express.RequestHandler = async (req, res) => {
  const { title } = req.body
  const { id } = req.params
  if (typeof title !== 'string')
    return res.status(400).send('Fields missing in PATCH /document')
  await updateDocument(id, title)

  res.sendStatus(200)
}

const deleteDocument: express.RequestHandler = async (req, res) => {
  await dropDocument(res.locals.currentUser, req.params.id)
  res.sendStatus(200)
}

const getShared: express.RequestHandler = async (req, res) => {
  const documents = await selectShared(res.locals.currentUser)
  res.json(documents)
}

const documentRouter = express.Router()

documentRouter.use('/:id/collaborator', collaboratorRouter)
documentRouter.get('/all', requireAuth(asyncHandler(getAllDocuments)))
documentRouter.get('/shared', requireAuth(asyncHandler(getShared)))
documentRouter.get('/:id', requireAuth(asyncHandler(getDocument)))
documentRouter.post('/', requireAuth(asyncHandler(createDocument)))
documentRouter.patch('/:id', requireAuth(asyncHandler(patchDocument)))
documentRouter.delete('/:id', requireAuth(asyncHandler(deleteDocument)))

export default documentRouter
