'use client'

import { useEffect } from 'react'
import Link from 'next/link'

import '@/styles/error-shared.css'
import '@/styles/nav.css'
import '@/styles/routeErrorFallback.css'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  useEffect(() => {
    console.error('[RouteError]', error.message, error)
  }, [error])

  return (
    <main className="route-error-content">
      <div className="error-boundary-content">
        <p className="error-boundary-message">Something went wrong</p>
        <button type="button" onClick={reset}>
          Try again
        </button>
        <Link href="/?page=1" className="nav-link">
          Back to Pokedex
        </Link>
      </div>
    </main>
  )
}
