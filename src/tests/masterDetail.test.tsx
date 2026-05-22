import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import { renderApp } from './testUtils.tsx'

const { searchPokemonMock, fetchPokemonDetailsMock } = vi.hoisted(() => ({
  searchPokemonMock: vi.fn(),
  fetchPokemonDetailsMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: (query: string, page?: number) => searchPokemonMock(query, page),
  fetchPokemonDetails: (id: string) => fetchPokemonDetailsMock(id),
}))

function sampleItems(count: number): PokemonDetails[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `pokemon-${i + 1}`,
    sprite: `https://example.com/sprite-${i + 1}.png`,
    flavorText: `Description for pokemon ${i + 1}.`,
  }))
}

describe('Master-Detail view', () => {
  beforeEach(() => {
    localStorage.clear()
    searchPokemonMock.mockReset()
    fetchPokemonDetailsMock.mockReset()
    searchPokemonMock.mockResolvedValue(sampleItems(2))
  })

  it('does not show details panel on initial load', async () => {
    renderApp(['/?page=1'])

    await screen.findAllByRole('article')
    expect(screen.queryByRole('complementary', { name: /pokémon details/i })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /close/i })).not.toBeInTheDocument()
  })

  it('opens details panel via Outlet and syncs URL when an item is clicked', async () => {
    const user = userEvent.setup()
    let resolveDetails!: (value: PokemonDetails) => void
    fetchPokemonDetailsMock.mockReturnValue(
      new Promise<PokemonDetails>((resolve) => {
        resolveDetails = resolve
      }),
    )

    const { router } = renderApp(['/?page=1'])
    const listArticles = await screen.findAllByRole('article')
    expect(listArticles).toHaveLength(2)

    await user.click(within(listArticles[0]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/details')
      expect(router.state.location.search).toContain('page=1')
      expect(router.state.location.search).toContain('details=1')
    })

    expect(screen.getByRole('complementary', { name: /pokémon details/i })).toBeInTheDocument()
    expect(screen.getByText('Loading details…')).toBeInTheDocument()
    expect(screen.getAllByRole('article').length).toBeGreaterThanOrEqual(2)

    resolveDetails({
      id: 1,
      name: 'pokemon-1',
      sprite: 'https://example.com/sprite-1.png',
      flavorText: 'Description for pokemon 1.',
    })

    await waitFor(() => {
      expect(screen.getByText('ID: 1')).toBeInTheDocument()
    })
  })

  it('closes details panel via close button and updates URL', async () => {
    const user = userEvent.setup()
    fetchPokemonDetailsMock.mockResolvedValue({
      id: 1,
      name: 'pokemon-1',
      sprite: 'https://example.com/sprite-1.png',
      flavorText: 'Description for pokemon 1.',
    })

    const { router } = renderApp(['/details?page=2&details=1'])

    await screen.findByRole('complementary', { name: /pokémon details/i })
    await user.click(screen.getByRole('button', { name: /close/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
      expect(router.state.location.search).toBe('?page=2')
    })
    expect(screen.queryByRole('complementary', { name: /pokémon details/i })).not.toBeInTheDocument()
  })

  it('closes details panel when clicking the main panel background', async () => {
    const user = userEvent.setup()
    fetchPokemonDetailsMock.mockResolvedValue({
      id: 1,
      name: 'pokemon-1',
      sprite: 'https://example.com/sprite-1.png',
      flavorText: 'Description for pokemon 1.',
    })

    const { router } = renderApp(['/details?page=1&details=1'])

    await screen.findByRole('complementary', { name: /pokémon details/i })
    await user.click(screen.getByRole('heading', { name: /^search$/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
      expect(router.state.location.search).toBe('?page=1')
    })
  })

  it('clears details from URL when a new search is submitted', async () => {
    const user = userEvent.setup()
    fetchPokemonDetailsMock.mockResolvedValue({
      id: 1,
      name: 'pokemon-1',
      sprite: 'https://example.com/sprite-1.png',
      flavorText: 'Description for pokemon 1.',
    })
    searchPokemonMock.mockResolvedValueOnce(sampleItems(2))
    searchPokemonMock.mockResolvedValueOnce([
      {
        id: 25,
        name: 'pikachu',
        sprite: 'https://example.com/pikachu.png',
        flavorText: 'Electric mouse.',
      },
    ])

    const { router } = renderApp(['/details?page=2&details=1'])
    await screen.findByRole('complementary', { name: /pokémon details/i })

    const input = screen.getByRole('textbox', { name: /pokémon name/i })
    await user.clear(input)
    await user.type(input, 'pikachu')
    await user.click(screen.getByRole('button', { name: /^search$/i }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/')
      expect(router.state.location.search).toBe('?page=1')
    })
    expect(screen.queryByRole('complementary', { name: /pokémon details/i })).not.toBeInTheDocument()
  })
})
