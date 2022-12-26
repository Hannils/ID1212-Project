import express from 'express'
import asyncHandler from 'express-async-handler'
import { auth } from 'firebase-admin'

import {
  dropCollaborator,
  dropDocument,
  insertCollaborator,
  insertDocument,
  selectCollaborators,
  selectDocument,
  selectDocuments,
  selectShared,
} from '../api/database'
import { requireAuth } from '../util/Misc'
import { Document, DocumentPreview } from '../util/Types'

const getCollaborators: express.RequestHandler = async (req, res) => {
  const document = await selectDocument(req.params.id)
  if (document === null) return res.sendStatus(404)

  res.json(await selectCollaborators(document))
}

const addCollaborator: express.RequestHandler = async (req, res) => {
  const { id } = req.params
  const { userId } = req.body

  if (typeof userId !== 'string')
    return res.status(400).send('Fields missing in POST /collaborator')

  const document = await selectDocument(id)

  if (document === null) return res.sendStatus(401)
  if (document.owner.uid !== res.locals.currentUser) return res.sendStatus(403)

  const collaborators = await selectCollaborators(document)

  if (collaborators.some((user) => user.uid === userId))
    return res.status(407).send('User is alredy a collaborator')

  await insertCollaborator(document, userId)

  res.sendStatus(200)
}

const deleteCollaborator: express.RequestHandler = async (req, res) => {
  const { id, collaborator } = req.params
  const reqUser = res.locals.currentUser

  const document = await selectDocument(id)

  // Make sure that both document and collaborator exist
  if (document === null) return res.sendStatus(404)
  const collaborators = await selectCollaborators(document)
  if (!collaborators.some(({ uid }) => uid === collaborator)) return res.sendStatus(404)

  // Make sure the requesting user is either owner or they are removing themselves
  if (reqUser !== document.owner.uid && collaborator !== reqUser)
    return res.sendStatus(403)

  await dropCollaborator(document, collaborator)

  res.sendStatus(200)
}

const collaboratorRouter = express.Router({ mergeParams: true })

collaboratorRouter.get('/', requireAuth(asyncHandler(getCollaborators)))
collaboratorRouter.post('/', requireAuth(asyncHandler(addCollaborator)))
collaboratorRouter.delete('/:collaborator', requireAuth(asyncHandler(deleteCollaborator)))

export default collaboratorRouter
