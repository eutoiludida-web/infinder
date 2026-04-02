import { NextResponse, type NextRequest } from 'next/server'

const PROTECTED_PATHS = ['/dashboard', '/ads', '/competitors', '/brand', '/settings', '/generate', '/videos']

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Allow webhook requests through
  if (pathname.startsWith('/api/payments/webhook')) {
    return NextResponse.next()
  }

  // Check if the path is protected
  const isProtected = PROTECTED_PATHS.some(p => pathname === p || pathname.startsWith(p + '/'))
  const isAuthPage = pathname === '/auth' || pathname.startsWith('/auth/')

  // Simple cookie-based auth check — look for Supabase auth cookies
  const hasAuthCookie = request.cookies.getAll().some(c =>
    c.name.startsWith('sb-') && c.name.includes('auth-token')
  )

  // Redirect unauthenticated users from protected routes to /auth
  if (isProtected && !hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/auth'
    return NextResponse.redirect(url)
  }

  // Redirect authenticated users away from /auth to dashboard
  if (isAuthPage && hasAuthCookie) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/ads/:path*',
    '/competitors/:path*',
    '/brand/:path*',
    '/settings/:path*',
    '/generate/:path*',
    '/videos/:path*',
    '/auth',
    '/auth/:path*',
  ],
}
