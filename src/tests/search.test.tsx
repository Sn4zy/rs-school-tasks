import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import SearchForm from '../components/searchForm.tsx'
import { SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'
import { renderWithProviders } from './testUtils.tsx'

function setup(options: { query?: string } = {}) {
  renderWithProviders(<SearchForm query={options.query ?? ''} />)
}

describe('SearchForm', () => {
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
      setup({ query: '' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => {
        expect(input).toHaveValue('charizard')
      })
    })

    it('shows empty input when no saved term exists', async () => {
      setup({ query: '' })

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
      setup({ query: '' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue(''))

      await user.type(input, 'eevee')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(localStorage.getItem(SEARCH_STORAGE_KEY)).toBe('eevee')
    })

    it('trims whitespace from search input before saving', async () => {
      const user = userEvent.setup()
      setup({ query: '' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue(''))

      await user.type(input, '  mewtwo  ')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(localStorage.getItem(SEARCH_STORAGE_KEY)).toBe('mewtwo')
    })
  })

  describe('localStorage integration', () => {
    it('retrieves saved search term on component mount', async () => {
      localStorage.setItem(SEARCH_STORAGE_KEY, 'squirtle')
      setup({ query: '' })

      await waitFor(() => {
        expect(screen.getByRole('textbox', { name: /pokémon name/i })).toHaveValue('squirtle')
      })
    })

    it('overwrites existing localStorage value when new search is performed', async () => {
      const user = userEvent.setup()
      localStorage.setItem(SEARCH_STORAGE_KEY, 'old-term')
      setup({ query: 'old-term' })

      const input = screen.getByRole('textbox', { name: /pokémon name/i })
      await waitFor(() => expect(input).toHaveValue('old-term'))

      await user.clear(input)
      await user.type(input, 'new-term')
      await user.click(screen.getByRole('button', { name: /^search$/i }))

      expect(localStorage.getItem(SEARCH_STORAGE_KEY)).toBe('new-term')
    })
  })
})
