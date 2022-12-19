import express from 'express'
import asyncHandler from 'express-async-handler'
import admin from 'firebase-admin'

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

/*
{
    "uid": "HpEeHEBzVRSBQWcAUVVdbyZixwz1",
    "email": "15hannils@gmail.com",
    "emailVerified": false,
    "displayName": "Hampus",
    "disabled": false,
    "metadata": {
        "lastSignInTime": null,
        "creationTime": "Mon, 19 Dec 2022 12:14:56 GMT",
        "lastRefreshTime": null
    },
    "tokensValidAfterTime": "Mon, 19 Dec 2022 12:14:56 GMT",
    "providerData": [
        {
            "uid": "15hannils@gmail.com",
            "displayName": "Hampus",
            "email": "15hannils@gmail.com",
            "providerId": "password"
        }
    ]
}
*/

const patchUser: express.RequestHandler = async (req, res) => {
  const { uid, props } = req.body
  if (typeof req.body.uid !== 'string')
    return res.status(400).json('Fileds missing in PATCH /user')
  const response = await admin.auth().updateUser(uid, props)
  res.status(200)
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
