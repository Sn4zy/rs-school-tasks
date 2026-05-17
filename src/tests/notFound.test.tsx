import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderApp } from './testUtils.tsx'

const { searchPokemonMock } = vi.hoisted(() => ({
  searchPokemonMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: (query: string, page?: number) => searchPokemonMock(query, page),
}))

describe('404 page', () => {
  beforeEach(() => {
    searchPokemonMock.mockReset()
    searchPokemonMock.mockResolvedValue([])
  })

  it('displays a 404 page for unknown routes', () => {
    renderApp(['/this-route-does-not-exist'])

    expect(screen.getByRole('heading', { name: /404.*page not found/i, level: 2 })).toBeInTheDocument()
    expect(screen.queryByRole('textbox', { name: /pokémon name/i })).not.toBeInTheDocument()
  })

  it('shows a clear message that the page was not found', () => {
    renderApp(['/unknown-path'])

    expect(
      screen.getByText(/the page you are looking for does not exist or has been moved/i),
    ).toBeInTheDocument()
  })

  it('provides navigation back to the main application', async () => {
    const user = userEvent.setup()
    const { router } = renderApp(['/missing-page'])

    await user.click(screen.getByRole('link', { name: /back to pokedex/i }))

    expect(router.state.location.pathname).toBe('/')
    expect(router.state.location.search).toBe('?page=1')
  })
})
