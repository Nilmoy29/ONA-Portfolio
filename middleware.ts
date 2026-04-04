import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export async function middleware(req: NextRequest) {
  const res = NextResponse.next()
  
  // Skip middleware for non-admin routes
  if (!req.nextUrl.pathname.startsWith('/admin')) {
    return res
  }
  
  // Skip auth check for login page and debug pages
  if (req.nextUrl.pathname === '/admin/login' || 
      req.nextUrl.pathname === '/admin/debug' || 
      req.nextUrl.pathname === '/admin/status') {
    console.log('🔧 Middleware: Allowing access, public admin page')
    return res
  }
  
  // For all other admin routes, allow access and let auth context handle authentication
  // This prevents cookie access issues and infinite redirects
  console.log('🔧 Middleware: Allowing access, auth context will handle authentication')
  return res
}

export const config = {
  matcher: ['/admin/:path*']
}