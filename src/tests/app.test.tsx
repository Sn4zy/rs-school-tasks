import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import { SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'
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

describe('App (integration)', () => {
  beforeEach(() => {
    localStorage.clear()
    searchPokemonMock.mockReset()
  })

  it('makes initial API call on component mount', async () => {
    searchPokemonMock.mockResolvedValue([])

    renderApp(['/?page=1'])

    await waitFor(() => {
      expect(searchPokemonMock).toHaveBeenCalledWith('', 1)
    })
  })

  it('handles search term from localStorage on initial load', async () => {
    localStorage.setItem(SEARCH_STORAGE_KEY, 'pikachu')
    searchPokemonMock.mockResolvedValue(sampleItems(1))

    renderApp(['/?page=1&q=pikachu'])

    expect(await screen.findByRole('textbox', { name: /pokémon name/i })).toHaveValue('pikachu')

    await waitFor(() => {
      expect(searchPokemonMock).toHaveBeenCalledWith('pikachu', 1)
    })
  })

  it('shows loading state while data is being fetched', () => {
    searchPokemonMock.mockImplementation(() => new Promise(() => {}))

    renderApp(['/?page=1'])

    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
  })

  it('shows results when data is loaded', async () => {
    searchPokemonMock.mockResolvedValue(sampleItems(2))

    renderApp(['/?page=1'])

    expect(await screen.findAllByRole('article')).toHaveLength(2)
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
    expect(screen.getByRole('link', { name: /next/i })).toBeInTheDocument()
  })

  it('handles API error responses (shows error panel)', async () => {
    searchPokemonMock.mockRejectedValue(new Error('Network error'))

    renderApp(['/?page=1'])

    expect(await screen.findByText('Network error')).toBeInTheDocument()
    expect(screen.queryByRole('link', { name: /next/i })).not.toBeInTheDocument()
  })

  it('calls API with correct parameters and manages search term state when user searches', async () => {
    const user = userEvent.setup()

    searchPokemonMock.mockImplementation((query: string) =>
      Promise.resolve(query.trim() === '' ? [] : sampleItems(1)),
    )

    const { router } = renderApp(['/?page=1'])

    expect(searchPokemonMock).toHaveBeenCalledWith('', 1)

    const input = screen.getByRole('textbox', { name: /pokémon name/i })
    await user.type(input, '  eevee  ')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    await waitFor(() => expect(searchPokemonMock).toHaveBeenCalledWith('eevee', 1))

    expect(await screen.findAllByRole('article')).toHaveLength(1)
    expect(router.state.location.search).toContain('page=1')
    expect(router.state.location.search).toContain('q=eevee')
  })
})
