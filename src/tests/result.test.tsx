import { render, screen, waitFor, within } from '@testing-library/react'

import type { PokemonDetails } from '../../types/index.ts'
import Result from '../components/result.tsx'

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

describe('Result', () => {
  beforeEach(() => {
    searchPokemonMock.mockReset()
  })

  describe('rendering', () => {
    it('renders correct number of items when data is provided', async () => {
      const items = sampleItems(3)
      searchPokemonMock.mockResolvedValue(items)

      render(<Result query="" />)

      expect(await screen.findAllByRole('article')).toHaveLength(3)
    })

    it('displays "no results" message when data array is empty', async () => {
      searchPokemonMock.mockResolvedValue([])

      render(<Result query="" />)

      expect(await screen.findByText('No items found.')).toBeInTheDocument()
    })

    it('shows loading state while fetching data', async () => {
      let resolveList!: (value: PokemonDetails[]) => void
      const pending = new Promise<PokemonDetails[]>((resolve) => {
        resolveList = resolve
      })
      searchPokemonMock.mockReturnValue(pending)

      render(<Result query="" />)

      expect(screen.getByText('Loading…')).toBeInTheDocument()

      resolveList([])
      await waitFor(() => {
        expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
      })
      expect(await screen.findByText('No items found.')).toBeInTheDocument()
    })
  })

  describe('data display', () => {
    it('correctly displays item names and descriptions', async () => {
      searchPokemonMock.mockResolvedValue([
        {
          id: 25,
          name: 'pikachu',
          sprite: 'https://example.com/pikachu.png',
          flavorText: 'It stores electricity in its cheeks.',
        },
        {
          id: 1,
          name: 'bulbasaur',
          sprite: 'https://example.com/bulbasaur.png',
          flavorText: 'A strange seed was planted on its back at birth.',
        },
      ])

      render(<Result query="" />)

      const articles = await screen.findAllByRole('article')
      expect(articles).toHaveLength(2)

      expect(within(articles[0]).getByRole('heading', { level: 3 })).toHaveTextContent('pikachu')
      expect(within(articles[0]).getByText('It stores electricity in its cheeks.')).toBeInTheDocument()

      expect(within(articles[1]).getByRole('heading', { level: 3 })).toHaveTextContent('bulbasaur')
      expect(
        within(articles[1]).getByText('A strange seed was planted on its back at birth.'),
      ).toBeInTheDocument()
    })

    it('handles missing or undefined data gracefully', async () => {
      searchPokemonMock.mockResolvedValue([
        {
          id: 99,
          name: '',
          sprite: '',
          flavorText: '',
        },
      ])

      render(<Result query="" />)

      const article = await screen.findByRole('article')
      expect(within(article).getByRole('heading', { level: 3 })).toHaveTextContent('')
      expect(within(article).getByRole('paragraph')).toHaveTextContent('')
    })
  })

  describe('error handling', () => {
    it('displays error message when API call fails', async () => {
      searchPokemonMock.mockRejectedValue(new Error('Network failure'))

      render(<Result query="" />)

      expect(await screen.findByText('Network failure')).toBeInTheDocument()
    })

    it('shows appropriate error for 4xx-style API failure', async () => {
      searchPokemonMock.mockRejectedValue(
        new Error('Failed to fetch Pokemon details: Not Found'),
      )

      render(<Result query="missingmon" />)

      expect(await screen.findByText('Failed to fetch Pokemon details: Not Found')).toBeInTheDocument()
    })

    it('shows appropriate error for 5xx-style API failure', async () => {
      searchPokemonMock.mockRejectedValue(
        new Error('Failed to fetch Pokemon list: Internal Server Error'),
      )

      render(<Result query="" />)

      expect(
        await screen.findByText('Failed to fetch Pokemon list: Internal Server Error'),
      ).toBeInTheDocument()
    })

    it('displays fallback message when rejection is not an Error instance', async () => {
      searchPokemonMock.mockRejectedValue('weird')

      render(<Result query="" />)

      expect(await screen.findByText('Could not load data.')).toBeInTheDocument()
    })
  })
})
