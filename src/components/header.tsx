'use client'

import type { ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'

import LanguageSwitcher from '@/components/languageSwitcher.tsx'
import { Link, usePathname } from '@/i18n/navigation.ts'
import type { Theme } from '../context/themeContext.ts'
import { useTheme } from '../context/useTheme.ts'
import '../styles/header.css'
import '../styles/nav.css'

export default function Header() {
  const t = useTranslations('nav')
  const appT = useTranslations('app')
  const themeT = useTranslations('theme')
  const { theme, setTheme } = useTheme()
  const pathname = usePathname()
  const isHome = pathname === '/'
  const isAbout = pathname === '/about'

  const handleThemeChange = (event: ChangeEvent<HTMLSelectElement>) => {
    setTheme(event.target.value as Theme)
  }

  return (
    <header className="app-header">
      <h1>{appT('title')}</h1>
      <div className="app-header__controls">
        <nav className="app-nav" aria-label={t('main')}>
          <Link
            href="/?page=1"
            className={`nav-link${isHome ? ' active' : ''}`}
            aria-current={isHome ? 'page' : undefined}
          >
            {t('home')}
          </Link>
          <Link
            href="/about"
            className={`nav-link${isAbout ? ' active' : ''}`}
            aria-current={isAbout ? 'page' : undefined}
          >
            {t('about')}
          </Link>
        </nav>

        <LanguageSwitcher />

        <label className="theme-select-label">
          {themeT('label')}
          <select
            className="theme-select"
            value={theme}
            onChange={handleThemeChange}
            aria-label={themeT('label')}
          >
            <option value="light">{themeT('light')}</option>
            <option value="dark">{themeT('dark')}</option>
          </select>
        </label>
      </div>
    </header>
  )
}
