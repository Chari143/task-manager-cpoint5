import { cookies } from 'next/headers'
import { jwtVerify } from 'jose'

export async function getUserIdFromCookies() {
  const c = await cookies()
  const token = c.get('token')?.value
  if (!token) return null
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'dev_secret_change_me')
    const { payload } = await jwtVerify(token, secret)
    const id = Number(payload.userId)
    return Number.isNaN(id) ? null : id
  } catch {
    return null
  }
}