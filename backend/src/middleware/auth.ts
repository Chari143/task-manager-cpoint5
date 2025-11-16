import { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'

export interface AuthedRequest extends Request {
  userId?: number
}

export function requireAuth(req: AuthedRequest, res: Response, next: NextFunction) {
  const token = req.cookies?.token || (req.headers.authorization?.startsWith('Bearer ') ? req.headers.authorization.slice(7) : undefined)
  if (!token) return res.status(401).json({ message: 'Unauthorized' })
  try {
    const secret = process.env.AUTH_SECRET || 'dev_secret_change_me'
    const payload = jwt.verify(token, secret) as { userId: number }
    const id = Number(payload.userId)
    if (!id || Number.isNaN(id)) return res.status(401).json({ message: 'Unauthorized' })
    req.userId = id
    next()
  } catch (e) {
    return res.status(401).json({ message: 'Unauthorized' })
  }
}