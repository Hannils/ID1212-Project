import { RequestHandler, Request, Response, NextFunction } from 'express'
import * as admin from "firebase-admin";

export function isValidHttpUrl(url: string) {
  let checkUrl
  try {
    checkUrl = new URL(url);
  } catch (_) {
    return false;
  }
  return checkUrl.protocol === "http:" || checkUrl.protocol === "https:";
}
export const useAuth: RequestHandler = async (req, res, next) => {
  const auth = req.headers.authorization;
  if (typeof auth === 'string') {
    try {
      const user = await admin.auth().verifyIdToken(auth)
      res.locals.currentUser = user.uid
      return next()
    } catch (_) { }
  }
  res.locals.currentUser = null
  next()

}

export function requireAuth(cb: CallableFunction) {
  return (req: Request, res: Response, next: NextFunction) => {
    if(res.locals.currentUser === null) return res.sendStatus(401)
    cb(req, res, next)
  }
}
