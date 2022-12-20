import express from 'express'
import asyncHandler from 'express-async-handler'
import { selectDocuments, selectDocument, insertDocument } from '../api/database'
import { requireAuth } from '../util/Misc'
import { Document } from "../util/Types";

const getDocument: express.RequestHandler = async (req, res) => {
    const document = await selectDocument(res.locals.currentUser, req.body.id);
}

const getAllDocuments: express.RequestHandler = async (req, res) => {
    const documents = await selectDocuments(res.locals.currentUser)
}

const createDocument: express.RequestHandler = async (req, res) => {

    const { title } = req.body
    if (typeof title !== 'string')
        return res.status(400).send('Fields missing in POST /document')

    const document: Document = {
        title,
        created_at: new Date(),
        owner: res.locals.currentUser,
        content: [],
    }

    const documentId = insertDocument(document)

    return res.json({ documentId })
}

const updateDocument: express.RequestHandler = async (req, res) => { }

const deleteDocument: express.RequestHandler = async (req, res) => { }

const getShared: express.RequestHandler = async (req, res) => { }

const getCollaborator: express.RequestHandler = async (req, res) => { }

const postCollaborator: express.RequestHandler = async (req, res) => { }

const deleteCollaborator: express.RequestHandler = async (req, res) => { }

const documentRouter = express.Router()

documentRouter.get('/all', requireAuth(asyncHandler(getAllDocuments)))
documentRouter.get('/:id', requireAuth(asyncHandler(getDocument)))
documentRouter.post('/', requireAuth(asyncHandler(createDocument)))
documentRouter.patch('/', requireAuth(asyncHandler(updateDocument)))
documentRouter.delete('/', requireAuth(asyncHandler(deleteDocument)))
documentRouter.get('/shared', requireAuth(asyncHandler(getShared)))
documentRouter.get('/:id/collaborator', requireAuth(asyncHandler(getCollaborator)))
documentRouter.post('/:id/collaborator/:collaborator', requireAuth(asyncHandler(postCollaborator)))
documentRouter.delete('/:id/collaborator/:collaborator', requireAuth(asyncHandler(deleteCollaborator)))

export default documentRouter
