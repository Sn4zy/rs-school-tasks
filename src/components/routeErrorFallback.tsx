import { useEffect } from 'react'
import { isRouteErrorResponse, Link, useRouteError } from 'react-router-dom'

export default function RouteErrorFallback() {
  const error = useRouteError()

  useEffect(() => {
    const message =
      isRouteErrorResponse(error) ? error.statusText || String(error.data) : error
    console.error('[RouteError]', message, error)
  }, [error])

  return (
    <main className="error-boundary-root">
      <div className="error-boundary-content">
        <p className="error-boundary-message">Something went wrong</p>
        <Link to={{ pathname: '/', search: '?page=1' }} className="nav-link">
          Back to Pokedex
        </Link>
      </div>
    </main>
  )
}
