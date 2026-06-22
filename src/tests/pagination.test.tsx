import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import { renderApp } from './testUtils.tsx'

const { searchPokemonMock } = vi.hoisted(() => ({
  searchPokemonMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: (query: string, page?: number) => searchPokemonMock(query, page),
  fetchPokemonDetails: vi.fn(),
}))

function sampleItems(count: number): PokemonDetails[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `pokemon-${i + 1}`,
    sprite: `https://example.com/sprite-${i + 1}.png`,
    flavorText: `Description for pokemon ${i + 1}.`,
  }))
}

describe('Pagination with URL sync', () => {
  beforeEach(() => {
    localStorage.clear()
    searchPokemonMock.mockReset()
    searchPokemonMock.mockResolvedValue(sampleItems(3))
  })

  it('shows pagination only after items are loaded', async () => {
    searchPokemonMock.mockImplementation(() => new Promise(() => {}))

    renderApp(['/?page=1'])

    expect(screen.queryByText('Page 1')).not.toBeInTheDocument()
  })

  it('updates URL when navigating to the next page', async () => {
    const user = userEvent.setup()
    const { router } = renderApp(['/?page=1'])

    await screen.findByText('Page 1')

    await user.click(screen.getByRole('link', { name: /next/i }))

    await waitFor(() => {
      expect(router.state.location.search).toBe('?page=2')
      expect(searchPokemonMock).toHaveBeenCalledWith('', 2)
    })
    expect(screen.getByText('Page 2')).toBeInTheDocument()
  })

  it('loads the page from the URL on initial visit', async () => {
    renderApp(['/?page=3'])

    await waitFor(() => {
      expect(searchPokemonMock).toHaveBeenCalledWith('', 3)
    })
    expect(await screen.findByText('Page 3')).toBeInTheDocument()
  })

  it('resets to page 1 in the URL when a new search is submitted', async () => {
    const user = userEvent.setup()
    const { router } = renderApp(['/?page=2'])

    await screen.findByText('Page 2')

    const input = screen.getByRole('textbox', { name: /pokémon name/i })
    await user.type(input, 'pikachu')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
      expect(router.state.location.search).toContain('page=1')
      expect(router.state.location.search).toContain('q=pikachu')
      expect(searchPokemonMock).toHaveBeenCalledWith('pikachu', 1)
    })
  })
})
