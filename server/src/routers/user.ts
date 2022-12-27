import express from 'express'
import asyncHandler from 'express-async-handler'
import admin from 'firebase-admin'
import { UserRecord } from 'firebase-admin/auth'

import { isValidHttpUrl, requireAuth } from '../util/Misc'

const getUser: express.RequestHandler = async (req, res) => {
  const { uid, email, phoneNumber } = req.query
  let response: UserRecord | null
  try {
    if (typeof uid === 'string') response = await admin.auth().getUser(uid)
    else if (typeof email === 'string')
      response = await admin.auth().getUserByEmail(email)
    else if (typeof phoneNumber === 'string')
      response = await admin.auth().getUserByPhoneNumber(phoneNumber)
    else return res.status(400).json('Fields missing in GET /user')
  } catch (error) {
    // User was not found
    response = null
  }
  res.json(response)
}

const createUser: express.RequestHandler = async (req, res) => {
  const { email, password, username } = req.body
  if (
    typeof email !== 'string' ||
    typeof password !== 'string' ||
    typeof username !== 'string'
  )
    return res.status(400).send('Fields missing in POST /user')

  const response = await admin.auth().createUser({
    email,
    emailVerified: false,
    password,
    displayName: username,
    disabled: false,
  })

  const token = await admin.auth().createCustomToken(response.uid)
  res.status(200).json({ signInToken: token })
}

const patchUser: express.RequestHandler = async (req, res) => {
  const { username, profilePicture } = req.body
  if (username === '') return res.sendStatus(400).json('Fields missing in PATCH /user')

  try {
    const response = await admin.auth().updateUser(res.locals.currentUser, {
      displayName: username,
      ...(isValidHttpUrl(profilePicture) && {
        photoURL: profilePicture,
      }),
    })
    res.sendStatus(200)
  } catch (error) {
    res.sendStatus(500)
  }
}

const deleteUser: express.RequestHandler = async (req, res) => {
  await admin.auth().deleteUser(res.locals.currentUser)
  res.sendStatus(200)
}

const userRouter = express.Router()
userRouter.get('/', asyncHandler(getUser))
userRouter.post('/', asyncHandler(createUser))
userRouter.patch('/', requireAuth(asyncHandler(patchUser)))
userRouter.delete('/', requireAuth(asyncHandler(deleteUser)))

export default userRouter
