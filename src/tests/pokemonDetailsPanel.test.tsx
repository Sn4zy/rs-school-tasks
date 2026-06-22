import { screen } from '@testing-library/react'

import type { PokemonDetails } from '../../types/index.ts'
import PokemonDetailsPanelClient from '../components/pokemonDetailsPanelClient.tsx'
import { renderWithSearchParams } from './testUtils.tsx'

const { fetchPokemonDetailsMock } = vi.hoisted(() => ({
  fetchPokemonDetailsMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: vi.fn(),
  fetchPokemonDetails: (nameOrId: string) => fetchPokemonDetailsMock(nameOrId),
}))

const samplePokemon: PokemonDetails = {
  id: 1,
  name: 'pokemon-1',
  sprite: 'https://example.com/1.png',
  flavorText: 'Description for pokemon 1.',
}

describe('PokemonDetailsPanelClient query states', () => {
  beforeEach(() => {
    fetchPokemonDetailsMock.mockReset()
  })

  it('shows loading indicator while details query is fetching', () => {
    fetchPokemonDetailsMock.mockImplementation(() => new Promise(() => {}))

    renderWithSearchParams(<PokemonDetailsPanelClient />, ['/?page=1&details=1'])

    expect(screen.getByText('Loading details…')).toBeInTheDocument()
    expect(screen.queryByText(samplePokemon.name)).not.toBeInTheDocument()
  })

  it('displays readable error when details query fails', async () => {
    fetchPokemonDetailsMock.mockRejectedValue(new Error('Failed to fetch Pokemon details: Not Found'))

    renderWithSearchParams(<PokemonDetailsPanelClient />, ['/?page=1&details=1'])

    expect(
      await screen.findByText('Failed to fetch Pokemon details: Not Found'),
    ).toBeInTheDocument()
  })

  it('renders pokemon details when query succeeds', async () => {
    fetchPokemonDetailsMock.mockResolvedValue(samplePokemon)

    renderWithSearchParams(<PokemonDetailsPanelClient />, ['/?page=1&details=1'])

    expect(await screen.findByText(samplePokemon.name)).toBeInTheDocument()
    expect(screen.getByText(samplePokemon.flavorText)).toBeInTheDocument()
    expect(screen.getByText(`ID: ${samplePokemon.id}`)).toBeInTheDocument()
  })
})
