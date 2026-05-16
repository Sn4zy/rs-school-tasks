import { Link } from 'react-router-dom'

import Header from '../components/header.tsx'

export default function AboutPage() {
  return (
    <main className="about-page">
      <Header />

      <section className="about-content">
        <h2>Author</h2>
        <p>
          This Pokedex application was built as part of the RS School React course. It lets you
          browse and search Pokémon using the public PokeAPI.
        </p>
        <p>
          <a
            href="https://rs.school/react/"
            target="_blank"
            rel="noreferrer"
            className="about-course-link"
          >
            RS School React course
          </a>
        </p>
      </section>

      <p>
        <Link to={{ pathname: '/', search: '?page=1' }} className="nav-link">
          Back to Pokedex
        </Link>
      </p>
    </main>
  )
}
