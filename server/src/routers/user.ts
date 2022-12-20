import express from 'express'
import asyncHandler from 'express-async-handler'
import admin from 'firebase-admin'
import { isValidHttpUrl } from '../util/Misc'

const getUser: express.RequestHandler = async (req, res) => {
  const { uid, email, phoneNumber } = req.body
  let response
  if (typeof uid === 'string') response = admin.auth().getUser(uid)
  else if (typeof email === 'string') response = admin.auth().getUserByEmail(email)
  else if (typeof phoneNumber === 'string') response = admin.auth().getUserByPhoneNumber(phoneNumber)
  else return res.status(400).json('Fields missing in GET /user')
  res.sendStatus(200).json(response)
}

const createUser: express.RequestHandler = async (req, res) => {
  console.log(req.body)
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
  let props;
  const token = req.headers.authorization;
  const { username, profilePicture } = req.body
  if (typeof token !== 'string') return res.status(401).json("Missing authorization for PATCH /user");
  if (username === '') return res.sendStatus(400).json("Fields missing in PATCH /user");
  isValidHttpUrl(profilePicture) ? props = {displayName: username, photoURL: profilePicture} : props = {displayName: username}
  const decodedToken: admin.auth.DecodedIdToken = await admin.auth().verifyIdToken(token);
  const response = await admin.auth().updateUser(decodedToken.uid, props)
  if (response) res.json({username: response.displayName, profilePicture: response.photoURL});
}

const deleteUser: express.RequestHandler = async (req, res) => {
  const { uid } = req.body
  if (typeof uid !== 'string')
    return res.status(400).json('Fields missing in DELETE /user')
  const response = await admin.auth().deleteUser(uid)
  res.status(200)
}

const signOut: express.RequestHandler = async (req, res) => {}

const userRouter = express.Router()
userRouter.get('/', asyncHandler(getUser))
userRouter.post('/', asyncHandler(createUser))
userRouter.patch('/', asyncHandler(patchUser))
userRouter.delete('/', asyncHandler(deleteUser))
userRouter.post('/signout', asyncHandler(signOut))

export default userRouter
