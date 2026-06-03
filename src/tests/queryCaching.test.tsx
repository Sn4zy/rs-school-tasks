import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { renderApp } from './testUtils.tsx'

type FetchCall = {
  url: string
}

function jsonResponse(
  data: unknown,
  init?: { status?: number; statusText?: string; headers?: Record<string, string> },
) {
  const status = init?.status ?? 200
  const statusText = init?.statusText ?? 'OK'
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
}

function createFetchMock() {
  const calls: FetchCall[] = []
  let hold = true

  const release = () => {
    hold = false
  }

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url =
      typeof input === 'string'
        ? input
        : input instanceof URL
          ? input.toString()
          : input instanceof Request
            ? input.url
            : String(input)
    calls.push({ url })

    while (hold) {
      // keep awaiting until release() is called
      await new Promise((r) => setTimeout(r, 0))
    }

    // list endpoint
    if (url.includes('/pokemon?limit=10&offset=')) {
      const offsetMatch = /offset=(\d+)/.exec(url)
      const offset = offsetMatch ? Number(offsetMatch[1]) : 0
      const startId = offset + 1
      return jsonResponse({
        count: 1000,
        results: [
          { name: `pokemon-${startId}`, url: `https://pokeapi.co/api/v2/pokemon/${startId}` },
          { name: `pokemon-${startId + 1}`, url: `https://pokeapi.co/api/v2/pokemon/${startId + 1}` },
        ],
      })
    }

    // pokemon details endpoint (by name)
    const pokemonMatch = /\/pokemon\/([^/?#]+)/.exec(url)
    if (pokemonMatch) {
      const name = pokemonMatch[1]
      const idMatch = /pokemon-(\d+)/.exec(name)
      const id = idMatch ? Number(idMatch[1]) : 25
      return jsonResponse({
        id,
        name,
        sprites: { front_default: `https://example.com/${id}.png` },
      })
    }

    // species endpoint
    const speciesMatch = /\/pokemon-species\/(\d+)/.exec(url)
    if (speciesMatch) {
      const id = Number(speciesMatch[1])
      return jsonResponse({
        flavor_text_entries: [
          { flavor_text: `Description for pokemon ${id}.`, language: { name: 'en' } },
        ],
      })
    }

    return jsonResponse({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' })
  })

  return { calls, fetchMock, release }
}

describe('RTK Query caching + loading indicators', () => {
  let fetchController: ReturnType<typeof createFetchMock>

  beforeEach(() => {
    fetchController = createFetchMock()
    vi.stubGlobal('fetch', fetchController.fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  it('shows loading while list query is fetching', async () => {
    renderApp(['/?page=1'])

    // the query starts, but our fetch mock is held
    expect(screen.getByText('Loading…')).toBeInTheDocument()

    fetchController.release()

    // after the fetch resolves, results show up
    expect(await screen.findAllByRole('article')).toHaveLength(2)
    expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
  })

  it('reuses cached list data when navigating back to a previously visited page', async () => {
    const user = userEvent.setup()

    const { store } = renderApp(['/?page=1'])
    fetchController.release()

    await screen.findAllByRole('article')

    const callsAfterPage1 = fetchController.calls.length
    expect(callsAfterPage1).toBeGreaterThan(0)

    // go to page 2
    await user.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument()
    })

    const callsAfterPage2 = fetchController.calls.length
    expect(callsAfterPage2).toBeGreaterThan(callsAfterPage1)

    // go back to page 1 (should use RTK Query cache, not refetch)
    await user.click(screen.getByRole('button', { name: /previous/i }))
    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument()
    })

    // allow any microtasks to run; there should be no new fetch calls
    await new Promise((r) => setTimeout(r, 0))
    expect(fetchController.calls.length).toBe(callsAfterPage2)

    // sanity: cached data still present in store
    expect(Object.keys(store.getState().pokemonApi.queries).length).toBeGreaterThan(0)
  })

  it('reuses cached details when closing and reopening the same pokemon details', async () => {
    const user = userEvent.setup()

    renderApp(['/?page=1'])
    fetchController.release()

    const listArticles = await screen.findAllByRole('article')
    await user.click(within(listArticles[0]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(screen.getByRole('complementary', { name: /pokémon details/i })).toBeInTheDocument()
    })

    const callsAfterOpen = fetchController.calls.length

    // close details
    await user.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => {
      expect(screen.queryByRole('complementary', { name: /pokémon details/i })).not.toBeInTheDocument()
    })

    // reopen the same item
    const articlesAfter = await screen.findAllByRole('article')
    await user.click(within(articlesAfter[0]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(screen.getByRole('complementary', { name: /pokémon details/i })).toBeInTheDocument()
    })

    // no new fetches should be required because details query stays cached for keepUnusedDataFor
    await new Promise((r) => setTimeout(r, 0))
    expect(fetchController.calls.length).toBe(callsAfterOpen)
  })
})

