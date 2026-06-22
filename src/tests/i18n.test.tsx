import { screen } from '@testing-library/react'

import ruMessages from '../../messages/ru.json'
import { renderApp } from './testUtils.tsx'

describe('Internationalization', () => {
  it('shows English UI by default', () => {
    renderApp(['/?page=1'])

    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^search$/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /language/i })).toHaveValue('en')
  })

  it('provides a client-side language switcher with English and Russian options', () => {
    renderApp(['/?page=1'])

    const languageSelect = screen.getByRole('combobox', { name: /language/i })
    expect(languageSelect).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /english/i })).toBeInTheDocument()
    expect(screen.getByRole('option', { name: /russian/i })).toBeInTheDocument()
  })

  it('shows Russian UI when the Russian locale is active', () => {
    renderApp(['/ru/?page=1'], { locale: 'ru', messages: ruMessages })

    expect(screen.getByRole('combobox', { name: /язык/i })).toHaveValue('ru')
    expect(screen.getByRole('link', { name: /главная/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /поиск/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /искать/i })).toBeInTheDocument()
  })
})
