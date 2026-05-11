import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import App from '../App.tsx'
import { SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'

const { searchPokemonMock } = vi.hoisted(() => ({
  searchPokemonMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: (query: string, page?: number) => searchPokemonMock(query, page),
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

    render(<App />)

    await waitFor(() => {
      expect(searchPokemonMock).toHaveBeenCalledWith('', 1)
    })
  })

  it('handles search term from localStorage on initial load', async () => {
    localStorage.setItem(SEARCH_STORAGE_KEY, 'pikachu')
    searchPokemonMock.mockResolvedValue(sampleItems(1))

    render(<App />)

    // Search input is populated from storage by Search component.
    expect(await screen.findByRole('textbox', { name: /pokémon name/i })).toHaveValue('pikachu')

    // Result is driven by App's committedQuery (initialized from storage).
    await waitFor(() => {
      expect(searchPokemonMock).toHaveBeenCalledWith('pikachu', 1)
    })
  })

  it('manages loading states during API calls (loading → success)', async () => {
    let resolveList!: (value: PokemonDetails[]) => void
    const pending = new Promise<PokemonDetails[]>((resolve) => {
      resolveList = resolve
    })
    searchPokemonMock.mockReturnValue(pending)

    render(<App />)

    expect(screen.getByText('Loading…')).toBeInTheDocument()

    resolveList(sampleItems(2))

    expect(await screen.findAllByRole('article')).toHaveLength(2)
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
  })

  it('handles API error responses (shows error panel)', async () => {
    searchPokemonMock.mockRejectedValue(new Error('Network error'))

    render(<App />)

    expect(await screen.findByText('Network error')).toBeInTheDocument()
  })

  it('calls API with correct parameters and manages search term state when user searches', async () => {
    const user = userEvent.setup()

    searchPokemonMock.mockResolvedValueOnce([]) // initial mount, query ''
    searchPokemonMock.mockResolvedValueOnce(sampleItems(1)) // after user search

    render(<App />)

    await waitFor(() => {
      expect(searchPokemonMock).toHaveBeenCalledWith('', 1)
    })

    const input = screen.getByRole('textbox', { name: /pokémon name/i })
    await user.type(input, '  eevee  ')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    // App state updates -> Result props change -> new API call.
    await waitFor(() => {
      expect(searchPokemonMock).toHaveBeenCalledWith('eevee', 1)
    })

    // Successful API response updates what the App renders (cards appear).
    expect(await screen.findAllByRole('article')).toHaveLength(1)
  })
})

