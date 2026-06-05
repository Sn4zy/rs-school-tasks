import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import type { SearchPokemonArg } from '../api/pokemonApi.ts'
import { selectIsItemSelected, selectSelectedCount } from '../store/selectedItemsSlice.ts'
import { renderApp } from './testUtils.tsx'

const { useSearchPokemonQueryMock } = vi.hoisted(() => ({
  useSearchPokemonQueryMock: vi.fn(),
}))

vi.mock('../api/pokemonApi.ts', async () => {
  const actual = await vi.importActual<typeof import('../api/pokemonApi.ts')>('../api/pokemonApi.ts')
  return {
    ...actual,
    useSearchPokemonQuery: (arg: SearchPokemonArg) => useSearchPokemonQueryMock(arg),
    usePokemonDetailsQuery: () => ({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: undefined,
    }),
  }
})

function sampleItems(count: number, startId = 1): PokemonDetails[] {
  return Array.from({ length: count }, (_, i) => ({
    id: startId + i,
    name: `pokemon-${startId + i}`,
    sprite: `https://example.com/sprite-${startId + i}.png`,
    flavorText: `Description for pokemon ${startId + i}.`,
  }))
}

describe('Selected items management', () => {
  beforeEach(() => {
    useSearchPokemonQueryMock.mockReset()
    useSearchPokemonQueryMock.mockReturnValue({
      data: sampleItems(2),
      isLoading: false,
      isFetching: false,
      error: undefined,
    })
  })

  it('renders a checkbox on each item', async () => {
    renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    expect(within(articles[0]).getByRole('checkbox', { name: /select pokemon-1/i })).toBeInTheDocument()
    expect(within(articles[1]).getByRole('checkbox', { name: /select pokemon-2/i })).toBeInTheDocument()
  })

  it('stores selection in Redux when checkbox is checked', async () => {
    const user = userEvent.setup()
    const { store } = renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))

    expect(selectSelectedCount(store.getState())).toBe(1)
    expect(selectIsItemSelected(1)(store.getState())).toBe(true)
    expect(articles[0]).toHaveClass('pokemon-card--selected')
  })

  it('removes selection from Redux when checkbox is unchecked', async () => {
    const user = userEvent.setup()
    const { store } = renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')
    const checkbox = within(articles[0]).getByRole('checkbox')

    await user.click(checkbox)
    await user.click(checkbox)

    expect(selectSelectedCount(store.getState())).toBe(0)
    expect(selectIsItemSelected(1)(store.getState())).toBe(false)
    expect(articles[0]).not.toHaveClass('pokemon-card--selected')
  })

  it('does not open the details panel when only the checkbox is clicked', async () => {
    const user = userEvent.setup()
    const { router } = renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))

    expect(router.state.location.pathname).toBe('/')
    expect(router.state.location.search).toBe('?page=1')
    expect(screen.queryByRole('complementary', { name: /pokémon details/i })).not.toBeInTheDocument()
  })

  it('opens the details panel when clicking the card body without changing selection', async () => {
    const user = userEvent.setup()
    const { router, store } = renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(router.state.location.pathname).toBe('/details')
      expect(router.state.location.search).toContain('details=1')
    })
    expect(selectSelectedCount(store.getState())).toBe(0)
    expect(within(articles[0]).getByRole('checkbox')).not.toBeChecked()
  })

  it('keeps checkbox selection independent from opening details', async () => {
    const user = userEvent.setup()
    const { router, store } = renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))
    await user.click(within(articles[1]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(router.state.location.search).toContain('details=2')
    })
    expect(selectIsItemSelected(1)(store.getState())).toBe(true)
    expect(selectIsItemSelected(2)(store.getState())).toBe(false)
    expect(within(articles[0]).getByRole('checkbox')).toBeChecked()
    expect(within(articles[1]).getByRole('checkbox')).not.toBeChecked()
  })

  it('persists selections across pagination', async () => {
    const user = userEvent.setup()
    useSearchPokemonQueryMock.mockImplementation((arg: SearchPokemonArg) => ({
      data: arg.page === 1 ? sampleItems(2, 1) : sampleItems(2, 3),
      isLoading: false,
      isFetching: false,
      error: undefined,
    }))

    const { store } = renderApp(['/?page=1'])
    let articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))
    expect(selectIsItemSelected(1)(store.getState())).toBe(true)

    await user.click(screen.getByRole('button', { name: /next/i }))
    articles = await screen.findAllByRole('article')
    expect(within(articles[0]).getByRole('checkbox', { name: /select pokemon-3/i })).not.toBeChecked()
    expect(selectIsItemSelected(1)(store.getState())).toBe(true)

    await user.click(screen.getByRole('button', { name: /previous/i }))
    articles = await screen.findAllByRole('article')
    expect(within(articles[0]).getByRole('checkbox', { name: /select pokemon-1/i })).toBeChecked()
  })

  it('persists selections when navigating to About and back', async () => {
    const user = userEvent.setup()
    const { store, router } = renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))
    await user.click(screen.getByRole('link', { name: /^about$/i }))

    expect(router.state.location.pathname).toBe('/about')
    expect(selectIsItemSelected(1)(store.getState())).toBe(true)

    await user.click(screen.getByRole('link', { name: /^home$/i }))
    const articlesAfter = await screen.findAllByRole('article')
    expect(within(articlesAfter[0]).getByRole('checkbox', { name: /select pokemon-1/i })).toBeChecked()
  })
})
