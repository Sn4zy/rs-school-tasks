import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import ErrorBoundary from '../components/errorBoundary.tsx'
import ErrorThrower from '../components/errorThrower.tsx'

function Boom(): never {
  throw new Error('Boom')
}

describe('ErrorBoundary', () => {
  it('catches and handles JavaScript errors in child components', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>,
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    } finally {
      consoleError.mockRestore()
    }
  })

  it('displays fallback UI when error occurs', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>,
      )

      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
      expect(screen.queryByRole('button', { name: /trigger error/i })).not.toBeInTheDocument()
    } finally {
      consoleError.mockRestore()
    }
  })

  it('logs error to console', () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(
        <ErrorBoundary>
          <Boom />
        </ErrorBoundary>,
      )

      expect(consoleError).toHaveBeenCalled()
      const hasBoundaryLog = consoleError.mock.calls.some((call) => call.includes('[ErrorBoundary]'))
      expect(hasBoundaryLog).toBe(true)
    } finally {
      consoleError.mockRestore()
    }
  })

  it('throws error when test button is clicked (via ErrorThrower)', async () => {
    const user = userEvent.setup()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(
        <ErrorBoundary>
          <ErrorThrower />
        </ErrorBoundary>,
      )

      await user.click(screen.getByRole('button', { name: /trigger error/i }))
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    } finally {
      consoleError.mockRestore()
    }
  })

  it('triggers error boundary fallback UI after error button click', async () => {
    const user = userEvent.setup()
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {})
    try {
      render(
        <ErrorBoundary>
          <ErrorThrower />
        </ErrorBoundary>,
      )

      await user.click(screen.getByRole('button', { name: /trigger error/i }))
      expect(screen.getByText('Something went wrong')).toBeInTheDocument()
    } finally {
      consoleError.mockRestore()
    }
  })
})

