import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderApp } from './testUtils.tsx'

const { searchPokemonMock } = vi.hoisted(() => ({
  searchPokemonMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: (query: string, page?: number) => searchPokemonMock(query, page),
}))

describe('About page', () => {
  beforeEach(() => {
    searchPokemonMock.mockReset()
    searchPokemonMock.mockResolvedValue([])
  })

  it('is reachable from the main app navigation', async () => {
    const user = userEvent.setup()
    const { router } = renderApp(['/?page=1'])

    await user.click(screen.getByRole('link', { name: /^about$/i }))

    expect(router.state.location.pathname).toBe('/about')
    expect(screen.getByRole('heading', { name: /^author$/i, level: 2 })).toBeInTheDocument()
  })

  it('shows author information and a link to the RS School React course', async () => {
    const user = userEvent.setup()
    renderApp(['/?page=1'])

    await user.click(screen.getByRole('link', { name: /^about$/i }))

    expect(
      screen.getByText(/built as part of the RS School React course/i),
    ).toBeInTheDocument()

    const courseLink = screen.getByRole('link', { name: /rs school react course/i })
    expect(courseLink).toHaveAttribute('href', 'https://rs.school/react/')
    expect(courseLink).toHaveAttribute('target', '_blank')
    expect(courseLink).toHaveAttribute('rel', 'noreferrer')
  })

  it('provides navigation back to the Pokedex from the About page', async () => {
    const user = userEvent.setup()
    const { router } = renderApp(['/about'])

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /^home$/i })).toBeInTheDocument()

    await user.click(screen.getByRole('link', { name: /back to pokedex/i }))

    expect(router.state.location.pathname).toBe('/')
    expect(router.state.location.search).toBe('?page=1')
  })
})
