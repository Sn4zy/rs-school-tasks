import { screen } from '@testing-library/react'

import type { PokemonDetails } from '../../types/index.ts'
import SearchResultsClient from '../components/searchResultsClient.tsx'
import { renderWithSearchParams } from './testUtils.tsx'

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

function renderResult(query = '') {
  return renderWithSearchParams(
    <SearchResultsClient page={1} query={query} selectedId={null} />,
    ['/?page=1'],
  )
}

describe('SearchResultsClient', () => {
  beforeEach(() => {
    searchPokemonMock.mockReset()
  })

  describe('rendering', () => {
    it('renders correct number of items when data is provided', async () => {
      searchPokemonMock.mockResolvedValue(sampleItems(3))

      renderResult()

      expect(await screen.findAllByRole('article')).toHaveLength(3)
    })

    it('displays "no results" message when data array is empty', async () => {
      searchPokemonMock.mockResolvedValue([])

      renderResult()

      expect(await screen.findByText('No items found.')).toBeInTheDocument()
    })
  })

  describe('pagination', () => {
    it('shows pagination controls for empty query', async () => {
      searchPokemonMock.mockResolvedValue(sampleItems(2))

      renderResult()

      expect(await screen.findByRole('link', { name: /next/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /previous/i })).toBeDisabled()
    })

    it('hides pagination controls for non-empty query', async () => {
      searchPokemonMock.mockResolvedValue(sampleItems(1))

      renderResult('pikachu')

      expect(await screen.findByRole('article')).toBeInTheDocument()
      expect(screen.queryByRole('link', { name: /next/i })).not.toBeInTheDocument()
    })
  })

  describe('error handling', () => {
    it('shows error panel when API call fails', async () => {
      searchPokemonMock.mockRejectedValue(new Error('Network error'))

      renderResult()

      expect(await screen.findByText('Network error')).toBeInTheDocument()
    })
  })
})
