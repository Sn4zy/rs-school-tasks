import { screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { renderApp } from './testUtils.tsx'

const { searchPokemonMock } = vi.hoisted(() => ({
  searchPokemonMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: (query: string, page?: number) => searchPokemonMock(query, page),
}))

vi.mock('../api/pokemonApi.ts', async () => {
  const actual = await vi.importActual<typeof import('../api/pokemonApi.ts')>('../api/pokemonApi.ts')
  return {
    ...actual,
    useSearchPokemonQuery: () => ({
      data: [],
      isLoading: false,
      isFetching: false,
      error: undefined,
    }),
  }
})

describe('Shared layout', () => {
  beforeEach(() => {
    searchPokemonMock.mockReset()
    searchPokemonMock.mockResolvedValue([])
  })

  it('renders the app shell on the home page', () => {
    renderApp(['/?page=1'])

    expect(screen.getByRole('heading', { name: /^pokedex$/i, level: 1 })).toBeInTheDocument()
    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /theme/i })).toBeInTheDocument()
    expect(screen.getByRole('combobox', { name: /language/i })).toBeInTheDocument()
  })

  it('keeps the shared shell when navigating between pages', async () => {
    const user = userEvent.setup()
    renderApp(['/?page=1'])

    await user.click(screen.getByRole('link', { name: /^about$/i }))

    expect(screen.getByRole('navigation', { name: /main navigation/i })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /author/i, level: 2 })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: /^pokedex$/i, level: 1 })).toBeInTheDocument()
  })
})
