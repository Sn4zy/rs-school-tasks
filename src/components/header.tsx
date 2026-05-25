import type { ChangeEvent } from 'react'
import { NavLink } from 'react-router-dom'

import type { Theme } from '../context/themeContext.ts'
import { useTheme } from '../context/useTheme.ts'
import '../styles/header.css'
import '../styles/nav.css'

export default function Header() {
  const { theme, setTheme } = useTheme()

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme)
  }

  return (
    <header className="app-header">
      <h1>Pokedex</h1>
      <div className="app-header__controls">
        <nav className="app-nav" aria-label="Main navigation">
          <NavLink to={{ pathname: '/', search: '?page=1' }} className="nav-link" end>
            Home
          </NavLink>
          <NavLink to="/about" className="nav-link">
            About
          </NavLink>
        </nav>

        <label className="theme-select-label">
          Theme
          <select
            className="theme-select"
            value={theme}
            onChange={handleThemeChange}
            aria-label="Theme"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
          </select>
        </label>
      </div>
    </header>
  )
}
