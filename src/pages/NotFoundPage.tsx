import { Link } from 'react-router-dom'

import '../styles/nav.css'
import '../styles/notFoundPage.css'

export default function NotFoundPage() {
  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <h2>404 — Page not found</h2>
        <p>The page you are looking for does not exist or has been moved.</p>
      </section>

      <p>
        <Link to={{ pathname: '/', search: '?page=1' }} className="nav-link">
          Back to Pokedex
        </Link>
      </p>
    </main>
  )
}
