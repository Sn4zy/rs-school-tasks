import '@testing-library/jest-dom/vitest'
import type { MouseEvent, ReactNode } from 'react'
import { vi } from 'vitest'

const locales = ['en', 'ru'] as const

function stripLocaleFromPath(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return '/'
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length) || '/'
    }
  }
  return pathname
}

function getPathnameFromRouter(asPath: string): string {
  const queryIndex = asPath.indexOf('?')
  const pathname = queryIndex === -1 ? asPath : asPath.slice(0, queryIndex)
  return stripLocaleFromPath(pathname || '/')
}

function getSearchParamsFromAsPath(asPath: string): URLSearchParams {
  const queryIndex = asPath.indexOf('?')
  const search = queryIndex === -1 ? '' : asPath.slice(queryIndex + 1)
  return new URLSearchParams(search)
}

vi.mock('next/navigation', () => {
  const { useRouter } = require('next-router-mock')

  function usePathname() {
    const router = useRouter()
    return getPathnameFromRouter(router.asPath)
  }

  function useSearchParams() {
    const router = useRouter()
    return getSearchParamsFromAsPath(router.asPath)
  }

  return {
    useRouter,
    usePathname,
    useSearchParams,
    useParams: () => useRouter().query,
    redirect: vi.fn(),
    notFound: vi.fn(),
  }
})

vi.mock('@/i18n/navigation.ts', () => {
  const React = require('react')
  const { default: mockRouter, useRouter } = require('next-router-mock')

  type LinkProps = {
    href: string | { pathname?: string; search?: string }
    onClick?: (event: MouseEvent<HTMLAnchorElement>) => void
    children: ReactNode
    className?: string
    'aria-current'?: 'page' | undefined
  }

  function Link({ href, onClick, children, ...rest }: LinkProps) {
    const url =
      typeof href === 'string'
        ? href
        : `${href.pathname ?? '/'}${href.search ?? ''}`

    return React.createElement(
      'a',
      {
        href: url,
        onClick: (event: MouseEvent<HTMLAnchorElement>) => {
          event.preventDefault()
          void mockRouter.push(url)
          onClick?.(event)
        },
        ...rest,
      },
      children,
    )
  }

  function usePathname() {
    const router = useRouter()
    return getPathnameFromRouter(router.asPath)
  }

  return {
    Link,
    useRouter,
    usePathname,
    redirect: vi.fn(),
    getPathname: vi.fn(),
  }
})
