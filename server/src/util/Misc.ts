import { NextFunction, Request, RequestHandler, Response } from 'express'
import * as admin from 'firebase-admin'

export function isValidHttpUrl(url: string) {
  let checkUrl
  try {
    checkUrl = new URL(url)
  } catch (_) {
    return false
  }
  return checkUrl.protocol === 'http:' || checkUrl.protocol === 'https:'
}
export const useAuth: RequestHandler = async (req, res, next) => {
  const auth = req.headers.authorization
  res.locals.currentUser = null

  if (typeof auth === 'string') {
    try {
      const user = await admin.auth().verifyIdToken(auth)
      res.locals.currentUser = user.uid
    } catch (_) {
      console.error('Invalid token')
    }
  }
  next()
}

export function requireAuth(cb: CallableFunction) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (res.locals.currentUser === null) return res.sendStatus(401)
    cb(req, res, next)
  }
}
