import { screen } from '@testing-library/react'

import type { PokemonDetails } from '../../types/index.ts'
import PokemonDetailsPanel from '../components/pokemonDetailsPanel.tsx'
import { renderWithSearchParams } from './testUtils.tsx'

const { usePokemonDetailsQueryMock } = vi.hoisted(() => ({
  usePokemonDetailsQueryMock: vi.fn(),
}))

vi.mock('../api/pokemonApi.ts', async () => {
  const actual = await vi.importActual<typeof import('../api/pokemonApi.ts')>('../api/pokemonApi.ts')
  return {
    ...actual,
    usePokemonDetailsQuery: (detailsId: string) => usePokemonDetailsQueryMock(detailsId),
  }
})

const samplePokemon: PokemonDetails = {
  id: 1,
  name: 'pokemon-1',
  sprite: 'https://example.com/1.png',
  flavorText: 'Description for pokemon 1.',
}

describe('PokemonDetailsPanel query states', () => {
  beforeEach(() => {
    usePokemonDetailsQueryMock.mockReset()
  })

  it('shows loading indicator while details query is fetching', () => {
    usePokemonDetailsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: undefined,
      refetch: vi.fn(),
    })

    renderWithSearchParams(<PokemonDetailsPanel />, ['/?page=1&details=1'])

    expect(screen.getByText('Loading details…')).toBeInTheDocument()
    expect(screen.queryByText(samplePokemon.name)).not.toBeInTheDocument()
  })

  it('displays readable error when details query fails', async () => {
    usePokemonDetailsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: { status: 404, data: 'Pokemon not found' },
      refetch: vi.fn(),
    })

    renderWithSearchParams(<PokemonDetailsPanel />, ['/?page=1&details=missing'])

    expect(await screen.findByText('Pokemon not found')).toBeInTheDocument()
  })

  it('displays fallback error when rejection has no readable message', async () => {
    usePokemonDetailsQueryMock.mockReturnValue({
      data: undefined,
      isLoading: false,
      isFetching: false,
      error: { status: 500 },
      refetch: vi.fn(),
    })

    renderWithSearchParams(<PokemonDetailsPanel />, ['/?page=1&details=1'])

    expect(await screen.findByText('Could not load details. (HTTP 500).')).toBeInTheDocument()
  })

  it('renders pokemon data when query succeeds', async () => {
    usePokemonDetailsQueryMock.mockReturnValue({
      data: samplePokemon,
      isLoading: false,
      isFetching: false,
      error: undefined,
      refetch: vi.fn(),
    })

    renderWithSearchParams(<PokemonDetailsPanel />, ['/?page=1&details=1'])

    expect(await screen.findByRole('heading', { name: samplePokemon.name })).toBeInTheDocument()
    expect(screen.getByText(samplePokemon.flavorText)).toBeInTheDocument()
  })
})
