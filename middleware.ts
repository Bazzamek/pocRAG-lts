import { type NextRequest, NextResponse } from 'next/server'
import { updateSession } from '@/utils/supabase/middleware'
import { isUserLoggedIn } from './lib/supabase.server'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  
  await updateSession(request)
  const isUser = await isUserLoggedIn(true)
  
  if(isUser){
    if (pathname === '/') {
      return NextResponse.redirect(new URL('/chat/new', request.url))
    }
  } else {
    if (pathname !== '/') {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }
  
  return NextResponse.next()
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
