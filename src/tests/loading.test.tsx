import { render, screen } from '@testing-library/react'

import Loading from '../components/Loading.tsx'

describe('Loading', () => {
  describe('rendering', () => {
    it('renders loading indicator (spinner) and default label', () => {
      const { container } = render(<Loading />)

      expect(container.querySelector('.loading-spinner')).toBeInTheDocument()
      expect(screen.getByText('Loading…')).toBeInTheDocument()
    })

    it('renders custom label when provided', () => {
      render(<Loading label="Fetching data..." />)
      expect(screen.getByText('Fetching data...')).toBeInTheDocument()
    })

    it('shows/hides based on loading prop (parent controls rendering)', () => {
      const { rerender } = render(<Loading />)
      expect(screen.getByText('Loading…')).toBeInTheDocument()

      rerender(<></>)
      expect(screen.queryByText('Loading…')).not.toBeInTheDocument()
    })
  })

  describe('accessibility', () => {
    it('exposes an accessible loading status', () => {
      render(<Loading />)
      expect(screen.getByRole('status')).toBeInTheDocument()
      expect(screen.getByLabelText('Loading')).toBeInTheDocument()
    })
  })
})

