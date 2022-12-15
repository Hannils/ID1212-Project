import express from 'express'
import asyncHandler from 'express-async-handler'

const getDocument: express.RequestHandler = async (req, res) => {}

const getAllDocuments: express.RequestHandler = async (req, res) => {}

const postDocument: express.RequestHandler = async (req, res) => {}

const patchDocument: express.RequestHandler = async (req, res) => {}

const deleteDocument: express.RequestHandler = async (req, res) => {}

const getShared: express.RequestHandler = async (req, res) => {}

const getCollaborator: express.RequestHandler = async (req, res) => {}

const postCollaborator: express.RequestHandler = async (req, res) => {}

const deleteCollaborator: express.RequestHandler = async (req, res) => {}

const documentRouter = express.Router()

documentRouter.get('/all', asyncHandler(getAllDocuments))
documentRouter.get('/:id', asyncHandler(getDocument))
documentRouter.post('/', asyncHandler(postDocument))
documentRouter.patch('/', asyncHandler(patchDocument))
documentRouter.delete('/', asyncHandler(deleteDocument))
documentRouter.get('/shared', asyncHandler(getShared))
documentRouter.get('/:id/collaborator', asyncHandler(getCollaborator))
documentRouter.post('/:id/collaborator/:collaborator', asyncHandler(postCollaborator))
documentRouter.delete('/:id/collaborator/:collaborator', asyncHandler(deleteCollaborator))

export default documentRouter
