import { screen, within } from '@testing-library/react'

import type { PokemonDetails } from '../../types/index.ts'
import type { SearchPokemonArg } from '../api/pokemonApi.ts'
import Result from '../components/result.tsx'
import { renderWithSearchParams } from './testUtils.tsx'

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

function renderResult(query = '') {
  return renderWithSearchParams(
    <Result query={query} selectedId={null} onSelectPokemon={vi.fn()} />,
    ['/?page=1'],
  )
}

describe('Result', () => {
  beforeEach(() => {
    useSearchPokemonQueryMock.mockReset()
  })

  describe('rendering', () => {
    it('renders correct number of items when data is provided', async () => {
      const items = sampleItems(3)
      useSearchPokemonQueryMock.mockReturnValue({
        data: items,
        isLoading: false,
        isFetching: false,
        error: undefined,
      })

      renderResult()

      expect(await screen.findAllByRole('article')).toHaveLength(3)
    })

    it('displays "no results" message when data array is empty', async () => {
      useSearchPokemonQueryMock.mockReturnValue({
        data: [],
        isLoading: false,
        isFetching: false,
        error: undefined,
      })

      renderResult()

      expect(await screen.findByText('No items found.')).toBeInTheDocument()
    })

    it('shows loading state while fetching data', () => {
      useSearchPokemonQueryMock.mockReturnValue({
        data: undefined,
        isLoading: true,
        isFetching: true,
        error: undefined,
      })

      renderResult()

      expect(screen.getByText('Loading…')).toBeInTheDocument()
      expect(screen.queryByText('No items found.')).not.toBeInTheDocument()
    })
  })

  describe('data display', () => {
    it('correctly displays item names and descriptions', async () => {
      useSearchPokemonQueryMock.mockReturnValue({
        data: [
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
        ],
        isLoading: false,
        isFetching: false,
        error: undefined,
      })

      renderResult()

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
      useSearchPokemonQueryMock.mockReturnValue({
        data: [
          {
            id: 99,
            name: '',
            sprite: '',
            flavorText: '',
          },
        ],
        isLoading: false,
        isFetching: false,
        error: undefined,
      })

      renderResult()

      const article = await screen.findByRole('article')
      expect(within(article).getByRole('heading', { level: 3 })).toHaveTextContent('')
      expect(within(article).getByRole('paragraph')).toHaveTextContent('')
    })
  })

  describe('error handling', () => {
    it('displays error message when API call fails', async () => {
      useSearchPokemonQueryMock.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: { data: 'Network failure' },
      })

      renderResult()

      expect(await screen.findByText('Network failure')).toBeInTheDocument()
    })

    it('shows appropriate error for 4xx-style API failure', async () => {
      useSearchPokemonQueryMock.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: { data: 'Failed to fetch Pokemon details: Not Found' },
      })

      renderResult('missingmon')

      expect(await screen.findByText('Failed to fetch Pokemon details: Not Found')).toBeInTheDocument()
    })

    it('shows appropriate error for 5xx-style API failure', async () => {
      useSearchPokemonQueryMock.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: { data: 'Failed to fetch Pokemon list: Internal Server Error' },
      })

      renderResult()

      expect(
        await screen.findByText('Failed to fetch Pokemon list: Internal Server Error'),
      ).toBeInTheDocument()
    })

    it('displays fallback message when rejection is not an Error instance', async () => {
      useSearchPokemonQueryMock.mockReturnValue({
        data: undefined,
        isLoading: false,
        isFetching: false,
        error: {},
      })

      renderResult()

      expect(await screen.findByText('Could not load data.')).toBeInTheDocument()
    })
  })
})
