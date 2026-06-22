import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import type { MockedFunction } from 'vitest'

import Search from '../components/search.tsx'
import { SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'
import { renderWithProviders } from './testUtils.tsx'

function setup(options: {
  committedQuery?: string
  onCommittedSearch?: MockedFunction<(trimmed: string) => void>
} = {}) {
  const onCommittedSearch: MockedFunction<(trimmed: string) => void> =
    options.onCommittedSearch ?? vi.fn()
  renderWithProviders(
    <Search
      committedQuery={options.committedQuery ?? ''}
      onCommittedSearch={onCommittedSearch}
    />,
  )
  return { onCommittedSearch }
}

describe('Search', () => {
  beforeEach(() => {
    localStorage.clear()
    vi.clearAllMocks()
  })

  describe('rendering', () => {
    it('renders search input and search button', () => {
      setup()

      expect(screen.getByRole('textbox', { name: /pokémon name/i })).toBeInTheDocument()
      expect(screen.getByRole('button', { name: /^search$/i })).toBeInTheDocument()
    })

    it('displays previously saved search term from localStorage on mount', async () => {
      localStorage.setItem(SEARCH_STORAGE_KEY, 'charizard')
      setup({ committedQuery: '' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => {
        expect(input).toHaveValue('charizard')
      })
    })

    it('shows empty input when no saved term exists', async () => {
      setup({ committedQuery: '' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => {
        expect(input).toHaveValue('')
      })
    })
  })

  describe('user interactions', () => {
    it('updates input value when user types', async () => {
      const user = userEvent.setup()
      setup()

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue(''))

      await user.type(input, 'bulbasaur')
      expect(input).toHaveValue('bulbasaur')
    })

    it('saves search term to localStorage when search button is clicked', async () => {
      const user = userEvent.setup()
      setup({ committedQuery: '' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue(''))

      await user.type(input, 'eevee')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(localStorage.getItem(SEARCH_STORAGE_KEY)).toBe('eevee')
    })

    it('trims whitespace from search input before saving', async () => {
      const user = userEvent.setup()
      const onCommittedSearch = vi.fn()
      setup({ committedQuery: '', onCommittedSearch })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue(''))

      await user.type(input, '  mewtwo  ')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(localStorage.getItem(SEARCH_STORAGE_KEY)).toBe('mewtwo')
      expect(onCommittedSearch).toHaveBeenCalledWith('mewtwo')
    })

    it('triggers search callback with correct parameters', async () => {
      const user = userEvent.setup()
      const onCommittedSearch = vi.fn()
      setup({ committedQuery: '', onCommittedSearch })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue(''))

      await user.type(input, 'snorlax')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(onCommittedSearch).toHaveBeenCalledWith('snorlax')
    })
  })

  describe('localStorage integration', () => {
    it('retrieves saved search term on component mount', async () => {
      localStorage.setItem(SEARCH_STORAGE_KEY, 'squirtle')
      const onCommittedSearch = vi.fn()
      setup({ committedQuery: '', onCommittedSearch })

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /pokémon name/i })).toHaveValue('squirtle')
      })
      expect(onCommittedSearch).toHaveBeenCalledWith('squirtle')
    })

    it('overwrites existing localStorage value when new search is performed', async () => {
      const user = userEvent.setup()
      localStorage.setItem(SEARCH_STORAGE_KEY, 'old-term')
      setup({ committedQuery: 'old-term' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue('old-term'))

      await user.clear(input)
      await user.type(input, 'new-term')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(localStorage.getItem(SEARCH_STORAGE_KEY)).toBe('new-term')
    })
  })
})
