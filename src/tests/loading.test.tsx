import { screen } from '@testing-library/react'

import Loading from '../components/Loading.tsx'
import { renderWithProviders } from './testUtils.tsx'

describe('Loading', () => {
  describe('rendering', () => {
    it('renders loading indicator (spinner) and default label', () => {
      const { container } = renderWithProviders(<Loading />)

      expect(container.querySelector('.loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('Loading…')).toBeInTheDocument()
    })

    it('renders custom label when provided', () => {
      renderWithProviders(<Loading label="Fetching data..." />)
      expect(screen.getByText('Fetching data...')).toBeInTheDocument()
    })

    it('shows/hides based on loading prop (parent controls rendering)', () => {
      const { unmount } = renderWithProviders(<Loading />)
      expect(screen.getByText('Loading…')).toBeInTheDocument()

      unmount()
      expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('exposes an accessible loading status', () => {
      renderWithProviders(<Loading />)
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    })
  })
})
