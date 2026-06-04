import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createRtkFetchMock } from './queryTestUtils.ts'
import { renderApp } from './testUtils.tsx'

describe('RTK Query caching + loading indicators', () => {
  let fetchController: ReturnType<typeof createRtkFetchMock>

  beforeEach(() => {
    localStorage.clear()
    fetchController = createRtkFetchMock({ hold: true })
    vi.stubGlobal('fetch', fetchController.fetchMock)
  })

  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  it('shows loading while list query is fetching', async () => {
    renderApp(['/?page=1'])

    expect(screen.getByText('Loading…')).toBeInTheDocument()

    fetchController.release()

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

    await user.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument()
    })

    const callsAfterPage2 = fetchController.calls.length
    expect(callsAfterPage2).toBeGreaterThan(callsAfterPage1)

    await user.click(screen.getByRole('button', { name: /previous/i }))
    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument()
    })

    await new Promise((r) => setTimeout(r, 0))
    expect(fetchController.calls.length).toBe(callsAfterPage2)

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

    await user.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => {
      expect(screen.queryByRole('complementary', { name: /pokémon details/i })).not.toBeInTheDocument()
    })

    const articlesAfter = await screen.findAllByRole('article')
    await user.click(within(articlesAfter[0]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(screen.getByRole('complementary', { name: /pokémon details/i })).toBeInTheDocument()
    })

    await new Promise((r) => setTimeout(r, 0))
    expect(fetchController.calls.length).toBe(callsAfterOpen)
  })

  it('refetches list data when Refresh results is clicked after returning to a cached page', async () => {
    const user = userEvent.setup()

    renderApp(['/?page=1'])
    fetchController.release()

    await screen.findAllByRole('article')

    await user.click(screen.getByRole('button', { name: /next/i }))
    await waitFor(() => {
      expect(screen.getByText('Page 2')).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /previous/i }))
    await waitFor(() => {
      expect(screen.getByText('Page 1')).toBeInTheDocument()
    })

    const callsBeforeRefresh = fetchController.calls.length

    await user.click(screen.getByRole('button', { name: /refresh results/i }))

    await waitFor(() => {
      expect(fetchController.calls.length).toBeGreaterThan(callsBeforeRefresh)
    })
  })

  it('refetches details when Refresh details is clicked after reopening cached details', async () => {
    const user = userEvent.setup()

    renderApp(['/?page=1'])
    fetchController.release()

    const listArticles = await screen.findAllByRole('article')
    await user.click(within(listArticles[0]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(screen.getByRole('complementary', { name: /pokémon details/i })).toBeInTheDocument()
    })

    await user.click(screen.getByRole('button', { name: /close/i }))
    await waitFor(() => {
      expect(screen.queryByRole('complementary', { name: /pokémon details/i })).not.toBeInTheDocument()
    })

    const articlesAfter = await screen.findAllByRole('article')
    await user.click(within(articlesAfter[0]).getByRole('heading', { level: 3 }))

    await waitFor(() => {
      expect(screen.getByRole('complementary', { name: /pokémon details/i })).toBeInTheDocument()
    })

    const callsBeforeRefresh = fetchController.calls.length

    await user.click(screen.getByRole('button', { name: /refresh details/i }))

    await waitFor(() => {
      expect(fetchController.calls.length).toBeGreaterThan(callsBeforeRefresh)
    })
  })
})
