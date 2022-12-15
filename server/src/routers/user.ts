import express from 'express'
import asyncHandler from 'express-async-handler'

const getUser: express.RequestHandler = (req, res) => {
    const auth = req.headers.authorization;
}

const postUser: express.RequestHandler = (req, res) => {}

const patchUser: express.RequestHandler = (req, res) => {}

const deleteUser: express.RequestHandler = (req, res) => {}

const signOut: express.RequestHandler = (req, res) => {}

const userRouter = express.Router()
userRouter.get('/', asyncHandler(getUser))
userRouter.post('/', asyncHandler(postUser))
userRouter.patch('/', asyncHandler(patchUser))
userRouter.delete('/', asyncHandler(deleteUser))
userRouter.post('/signout', asyncHandler(signOut))

export default userRouter
