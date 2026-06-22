import createMiddleware from 'next-intl/middleware'
import { type NextRequest, NextResponse } from 'next/server'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

function isHomePath(pathname: string): boolean {
  return pathname === '/' || routing.locales.some((locale) => pathname === `/${locale}`)
}

export default function middleware(request: NextRequest) {
  const { pathname, searchParams } = request.nextUrl

  if (isHomePath(pathname) && !searchParams.has('page')) {
    const url = request.nextUrl.clone()
    url.searchParams.set('page', '1')
    return NextResponse.redirect(url)
  }

  return intlMiddleware(request)
}

export const config = {
  matcher: [
    '/',
    '/(ru|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
