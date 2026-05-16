import { NavLink } from 'react-router-dom'

export default function Header() {
  return (
    <header className="app-header">
      <h1>Pokedex</h1>
      <nav className="app-nav" aria-label="Main navigation">
        <NavLink to={{ pathname: '/', search: '?page=1' }} className="nav-link" end>
          Home
        </NavLink>
        <NavLink to="/about" className="nav-link">
          About
        </NavLink>
      </nav>
    </header>
  )
}
