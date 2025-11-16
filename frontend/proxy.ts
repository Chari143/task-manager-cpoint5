import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import { jwtVerify } from 'jose'

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('token')?.value
  const authUrls = ['/signin', '/signup']
  const isAuthUrl = authUrls.some((p) => pathname.startsWith(p))
  if (isAuthUrl) {
    if (token) return NextResponse.redirect(new URL('/', request.url))
    return NextResponse.next()
  }
  if (!token) return NextResponse.redirect(new URL('/signin', request.url))
  try {
    const secret = new TextEncoder().encode(process.env.AUTH_SECRET || 'secret')
    await jwtVerify(token, secret)
  } catch {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  return NextResponse.next()
}
