import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import type { SearchPokemonArg } from '../api/pokemonApi.ts'
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

describe('Pagination with URL sync', () => {
  beforeEach(() => {
    localStorage.clear()
    useSearchPokemonQueryMock.mockReset()
    useSearchPokemonQueryMock.mockReturnValue({
      data: sampleItems(3),
      isLoading: false,
      isFetching: false,
      error: undefined,
    })
  })

  it('shows pagination only after items are loaded', async () => {
    useSearchPokemonQueryMock.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: undefined,
    })

    renderApp(['/?page=1'])

    expect(screen.queryByText('Page 1')).not.toBeInTheDocument()
  })

  it('updates URL when navigating to the next page', async () => {
    const user = userEvent.setup()
    const { router } = renderApp(['/?page=1'])

    await screen.findByText('Page 1')

    await user.click(screen.getByRole('button', { name: /next/i }))

    await waitFor(() => {
      expect(router.state.location.search).toBe('?page=2')
      expect(useSearchPokemonQueryMock).toHaveBeenCalledWith({ query: '', page: 2 })
    })
    expect(screen.getByText('Page 2')).toBeInTheDocument()
  })

  it('loads the page from the URL on initial visit', async () => {
    renderApp(['/?page=3'])

    await waitFor(() => {
      expect(useSearchPokemonQueryMock).toHaveBeenCalledWith({ query: '', page: 3 })
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
      expect(router.state.location.search).toBe('?page=1')
      expect(useSearchPokemonQueryMock).toHaveBeenCalledWith({ query: 'pikachu', page: 1 })
    })
  })
})
