import { screen, waitFor, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { createRtkFetchMock } from './queryTestUtils.ts'
import { renderApp } from './testUtils.tsx'

describe('RTK Query feature tests', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    localStorage.clear()
  })

  describe('loading states', () => {
    let fetchController: ReturnType<typeof createRtkFetchMock>

    beforeEach(() => {
      localStorage.clear()
      fetchController = createRtkFetchMock({ hold: true })
      vi.stubGlobal('fetch', fetchController.fetchMock)
    })

    it('shows list loading indicator while search query is in flight', () => {
      renderApp(['/?page=1'])
      expect(screen.getByText('Loading…')).toBeInTheDocument()
    })

    it('shows details loading indicator while details query is in flight', async () => {
      const user = userEvent.setup()

      renderApp(['/?page=1'])
      fetchController.release()
      await screen.findAllByRole('article')

      fetchController = createRtkFetchMock({ hold: true })
      vi.stubGlobal('fetch', fetchController.fetchMock)

      const listArticles = await screen.findAllByRole('article')
      await user.click(within(listArticles[0]).getByRole('heading', { level: 3 }))

      expect(await screen.findByText('Loading details…')).toBeInTheDocument()
    })
  })

  describe('error states', () => {
    beforeEach(() => {
      localStorage.clear()
    })

    it('displays a readable list error when the list API fails', async () => {
      const fetchController = createRtkFetchMock({ failList: true })
      vi.stubGlobal('fetch', fetchController.fetchMock)

      renderApp(['/?page=1'])

      expect(await screen.findByText('Internal Server Error')).toBeInTheDocument()
      expect(screen.queryByRole('article')).not.toBeInTheDocument()
    })

    it('displays a readable details error when the details API fails', async () => {
      const user = userEvent.setup()
      const fetchController = createRtkFetchMock({ failPokemonMatching: '1' })
      vi.stubGlobal('fetch', fetchController.fetchMock)

      renderApp(['/?page=1'])
      await screen.findAllByRole('article')

      const listArticles = screen.getAllByRole('article')
      await user.click(within(listArticles[0]).getByRole('heading', { level: 3 }))

      expect(await screen.findByText('Not Found')).toBeInTheDocument()
    })

    it('displays a readable search error when a query returns 404', async () => {
      const user = userEvent.setup()
      const fetchController = createRtkFetchMock({ failPokemonMatching: 'not-a-real-mon' })
      vi.stubGlobal('fetch', fetchController.fetchMock)

      renderApp(['/?page=1'])

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await user.clear(input)
      await user.type(input, 'not-a-real-mon')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(await screen.findByText('Not Found')).toBeInTheDocument()
    })
  })

  describe('caching behavior', () => {
    let fetchController: ReturnType<typeof createRtkFetchMock>

    beforeEach(() => {
      localStorage.clear()
      fetchController = createRtkFetchMock()
      vi.stubGlobal('fetch', fetchController.fetchMock)
    })

    it('reuses cached list data when returning to a previous page', async () => {
      const user = userEvent.setup()

      renderApp(['/?page=1'])
      await screen.findAllByRole('article')
      const callsAfterPage1 = fetchController.calls.length

      await user.click(screen.getByRole('button', { name: /next/i }))
      await waitFor(() => expect(screen.getByText('Page 2')).toBeInTheDocument())
      const callsAfterPage2 = fetchController.calls.length
      expect(callsAfterPage2).toBeGreaterThan(callsAfterPage1)

      await user.click(screen.getByRole('button', { name: /previous/i }))
      await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument())

      await new Promise((r) => setTimeout(r, 0))
      expect(fetchController.calls.length).toBe(callsAfterPage2)
    })

    it('reuses cached search results when the same query is submitted again', async () => {
      const user = userEvent.setup()

      renderApp(['/?page=1'])
      await screen.findAllByRole('article')

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await user.clear(input)
      await user.type(input, 'pokemon-1')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument()
      })
      await user.clear(input)
      await user.click(screen.getByRole('button', { name: /^search$/i }))
      await waitFor(() => {
        expect(screen.getAllByRole('article').length).toBeGreaterThan(1)
      })
      const callsAfterEmptySearch = fetchController.calls.length
      expect(callsAfterEmptySearch).toBeGreaterThan(0)

      await user.clear(input)
      await user.type(input, 'pokemon-1')
      await user.click(screen.getByRole('button', { name: /^search$/i }))
      await waitFor(() => {
        expect(screen.getByRole('heading', { name: 'pokemon-1' })).toBeInTheDocument()
      })

      await new Promise((r) => setTimeout(r, 0))
      expect(fetchController.calls.length).toBe(callsAfterEmptySearch)
    })

    it('refetches after manual refresh invalidates cached list data', async () => {
      const user = userEvent.setup()

      renderApp(['/?page=1'])
      await screen.findAllByRole('article')

      await user.click(screen.getByRole('button', { name: /next/i }))
      await waitFor(() => expect(screen.getByText('Page 2')).toBeInTheDocument())

      await user.click(screen.getByRole('button', { name: /previous/i }))
      await waitFor(() => expect(screen.getByText('Page 1')).toBeInTheDocument())

      const callsBeforeRefresh = fetchController.calls.length
      await user.click(screen.getByRole('button', { name: /refresh results/i }))

      await waitFor(() => {
        expect(fetchController.calls.length).toBeGreaterThan(callsBeforeRefresh)
      })
    })
  })
})
