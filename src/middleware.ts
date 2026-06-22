import createMiddleware from 'next-intl/middleware'
import { NextRequest } from 'next/server'

import { routing } from './i18n/routing'

const intlMiddleware = createMiddleware(routing)

function isHomePath(pathname: string): boolean {
  return pathname === '/' || routing.locales.some((locale) => pathname === `/${locale}`)
}

function isDetailsPath(pathname: string): boolean {
  return (
    pathname === '/details' ||
    routing.locales.some((locale) => pathname === `/${locale}/details`)
  )
}

function ensurePageParam(url: URL): URL {
  const nextUrl = new URL(url)

  if ((isHomePath(nextUrl.pathname) || isDetailsPath(nextUrl.pathname)) && !nextUrl.searchParams.has('page')) {
    nextUrl.searchParams.set('page', '1')
  }

  return nextUrl
}

export default function middleware(request: NextRequest) {
  const url = ensurePageParam(request.nextUrl)

  return intlMiddleware(
    new NextRequest(url, {
      headers: request.headers,
    }),
  )
}

export const config = {
  matcher: [
    '/',
    '/(ru|en)/:path*',
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
}
