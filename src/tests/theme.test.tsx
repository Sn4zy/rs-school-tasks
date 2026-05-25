import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, describe, expect, it } from 'vitest'

import { useTheme } from '../context/useTheme.ts'
import { renderApp, renderWithProviders } from './testUtils.tsx'

function ThemeProbe() {
  const { theme, setTheme } = useTheme()

  return (
    <>
      <p>Current theme: {theme}</p>
      <button type="button" onClick={() => setTheme('dark')}>
        Set dark
      </button>
    </>
  )
}

describe('Theme context', () => {
  afterEach(() => {
    delete document.documentElement.dataset.theme
  })

  it('provides theme state through Context API and applies it to the document root', async () => {
    const user = userEvent.setup()
    renderWithProviders(<ThemeProbe />, { initialTheme: 'light' })

    expect(screen.getByText('Current theme: light')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'light')

    await user.click(screen.getByRole('button', { name: /set dark/i }))

    expect(screen.getByText('Current theme: dark')).toBeInTheDocument()
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('has a theme selection control at the top of the app', async () => {
    const user = userEvent.setup()
    renderApp(['/?page=1'], { initialTheme: 'light' })

    const themeSelect = screen.getByRole('combobox', { name: /theme/i })
    expect(themeSelect).toHaveValue('light')

    await user.selectOptions(themeSelect, 'dark')

    expect(themeSelect).toHaveValue('dark')
    expect(document.documentElement).toHaveAttribute('data-theme', 'dark')
  })

  it('defines light and dark CSS variable themes for the whole app', () => {
    const cssPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../styles/global.css',
    )
    const css = readFileSync(cssPath, 'utf8')

    expect(css).toMatch(/:root\[data-theme='light'\]/)
    expect(css).toMatch(/:root\[data-theme='dark'\]/)
    expect(css).toMatch(/--bg:/)
    expect(css).toMatch(/--text-h:/)
  })
})
