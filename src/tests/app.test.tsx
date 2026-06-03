import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import type { SearchPokemonArg } from '../api/pokemonApi.ts'
import { SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'
import { renderApp } from './testUtils.tsx'

const { useSearchPokemonQueryMock } = vi.hoisted(() => ({
  useSearchPokemonQueryMock: vi.fn(),
}))

vi.mock('../api/pokemonApi.ts', async () => {
  const actual = await vi.importActual<typeof import('../api/pokemonApi.ts')>('../api/pokemonApi.ts')
  return {
    ...actual,
    useSearchPokemonQuery: (arg: SearchPokemonArg) => useSearchPokemonQueryMock(arg),
  }
})

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
    useSearchPokemonQueryMock.mockReset()
  })

  it('makes initial API call on component mount', async () => {
    useSearchPokemonQueryMock.mockReturnValue({
      data: [],
      isLoading: false,
      isFetching: false,
      error: undefined,
    })

    renderApp(['/?page=1'])

    await waitFor(() => {
      expect(useSearchPokemonQueryMock).toHaveBeenCalledWith({ query: '', page: 1 })
    })
  })

  it('handles search term from localStorage on initial load', async () => {
    localStorage.setItem(SEARCH_STORAGE_KEY, 'pikachu')
    useSearchPokemonQueryMock.mockReturnValue({
      data: sampleItems(1),
      isLoading: false,
      isFetching: false,
      error: undefined,
    })

    renderApp(['/?page=1'])

    expect(await screen.findByRole('textbox', { name: /pokémon name/i })).toHaveValue('pikachu')

    await waitFor(() => {
      expect(useSearchPokemonQueryMock).toHaveBeenCalledWith({ query: 'pikachu', page: 1 })
    })
  })

  it('shows loading state while data is being fetched', () => {
    useSearchPokemonQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: undefined,
    })

    renderApp(['/?page=1'])

    expect(screen.getByText('Loading…')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
  })

  it('shows results when data is loaded', async () => {
    useSearchPokemonQueryMock.mockReturnValue({
      data: sampleItems(2),
      isLoading: false,
      isFetching: false,
      error: undefined,
    })

    renderApp(['/?page=1'])

    expect(await screen.findAllByRole('article')).toHaveLength(2)
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
    expect(screen.getByRole('button', { name: /next/i })).toBeInTheDocument()
  })

  it('handles API error responses (shows error panel)', async () => {
    useSearchPokemonQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: { data: 'Network error' },
    })

    renderApp(['/?page=1'])

    expect(await screen.findByText('Network error')).toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /next/i })).not.toBeInTheDocument()
  })

  it('calls API with correct parameters and manages search term state when user searches', async () => {
    const user = userEvent.setup()

    useSearchPokemonQueryMock.mockImplementation((arg: SearchPokemonArg) => ({
      data: arg.query.trim() === '' ? [] : sampleItems(1),
      isLoading: false,
      isFetching: false,
      error: undefined,
    }))

    const { router } = renderApp(['/?page=1'])

    expect(useSearchPokemonQueryMock).toHaveBeenCalledWith({ query: '', page: 1 })

    const input = screen.getByRole('textbox', { name: /pokémon name/i })
    await user.type(input, '  eevee  ')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    await waitFor(() => expect(useSearchPokemonQueryMock).toHaveBeenCalledWith({ query: 'eevee', page: 1 }))

    expect(await screen.findAllByRole('article')).toHaveLength(1)
    expect(router.state.location.search).toBe('?page=1')
  })
})
