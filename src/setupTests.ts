import '@testing-library/jest-dom/vitest'
import type { MouseEvent, ReactNode } from 'react'
import { vi } from 'vitest'

vi.mock('next/navigation', () => {
  const { useRouter } = require('next-router-mock')

  function usePathname() {
    return useRouter().pathname
  }

  function useSearchParams() {
    const router = useRouter()
    const queryIndex = router.asPath.indexOf('?')
    const search = queryIndex === -1 ? '' : router.asPath.slice(queryIndex + 1)
    return new URLSearchParams(search)
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

vi.mock('next/link', () => {
  const React = require('react')
  const { default: mockRouter } = require('next-router-mock')

  type LinkProps = {
    href: string | { pathname?: string; search?: string; query?: Record<string, string> }
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

  return { default: Link }
})
