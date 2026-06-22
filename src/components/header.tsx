'use client'

import type { ChangeEvent } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

import type { Theme } from '../context/themeContext.ts'
import { useTheme } from '../context/useTheme.ts'
import '../styles/header.css'
import '../styles/nav.css'

export default function Header() {
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAbout = pathname === '/about'

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme)
  }

  return (
    <header className="app-header">
      <h1>Pokedex</h1>
      <div className="app-header__controls">
        <nav className="app-nav" aria-label="Main navigation">
          <Link
            href="/?page=1"
            className={`nav-link${isHome ? ' active' : ''}`}
            aria-current={isHome ? 'page' : undefined}
          >
            Home
          </Link>
          <Link
            href="/about"
            className={`nav-link${isAbout ? ' active' : ''}`}
            aria-current={isAbout ? 'page' : undefined}
          >
            About
          </Link>
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
