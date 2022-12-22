import express from 'express'
import asyncHandler from 'express-async-handler'
import { auth } from 'firebase-admin'

import {
  dropDocument,
  insertCollaborator,
  insertDocument,
  selectDocument,
  selectDocuments,
} from '../api/database'
import { requireAuth } from '../util/Misc'
import { Document } from '../util/Types'

const getDocument: express.RequestHandler = async (req, res) => {
  const document = await selectDocument(res.locals.currentUser, req.params.id)
  if (document === null) return res.sendStatus(404)

  console.log('Document', document)

  res.json(document)
}

const getAllDocuments: express.RequestHandler = async (req, res) => {
  const documents = await selectDocuments(res.locals.currentUser)
  console.log('Documents', documents)
  res.json(documents)
}

const createDocument: express.RequestHandler = async (req, res) => {
  const { title } = req.body
  if (typeof title !== 'string')
    return res.status(400).send('Fields missing in POST /document')

  const document: Omit<Document, 'id'> = {
    title,
    created_at: new Date(),
    owner: res.locals.currentUser,
    collaborators: [],
    content: [],
  }

  const documentId = await insertDocument(document)

  return res.json({ documentId })
}

const updateDocument: express.RequestHandler = async (req, res) => {}

const deleteDocument: express.RequestHandler = async (req, res) => {
  await dropDocument(res.locals.currentUser, req.params.id)
  res.sendStatus(200)
}

const getShared: express.RequestHandler = async (req, res) => {}

const getCollaborator: express.RequestHandler = async (req, res) => {}

const addCollaborator: express.RequestHandler = async (req, res) => {
  const { id, userId } = req.params

  if (typeof userId !== 'string')
    return res.status(400).send('Fields missing in POST /collaborator')

  const document = await selectDocument(res.locals.currentUser, id)

  if (document === null) return res.sendStatus(401)

  // TODO CHECK IF ALREADY COLLABORATOR

  await insertCollaborator(document, userId)

  res.sendStatus(200)
}

const deleteCollaborator: express.RequestHandler = async (req, res) => {}

const documentRouter = express.Router()

documentRouter.get('/all', requireAuth(asyncHandler(getAllDocuments)))
documentRouter.get('/:id', requireAuth(asyncHandler(getDocument)))
documentRouter.post('/', requireAuth(asyncHandler(createDocument)))
documentRouter.patch('/', requireAuth(asyncHandler(updateDocument)))
documentRouter.delete('/:id', requireAuth(asyncHandler(deleteDocument)))
documentRouter.get('/shared', requireAuth(asyncHandler(getShared)))
documentRouter.get('/:id/collaborator', requireAuth(asyncHandler(getCollaborator)))
documentRouter.post(
  '/:id/collaborator/:userId',
  requireAuth(asyncHandler(addCollaborator)),
)
documentRouter.delete(
  '/:id/collaborator/:collaborator',
  requireAuth(asyncHandler(deleteCollaborator)),
)

export default documentRouter
