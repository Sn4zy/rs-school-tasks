import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import { AppContent } from '../App.tsx'
import ErrorBoundary from '../components/errorBoundary.tsx'

type RenderWithRouterResult = RenderResult & {
  router: ReturnType<typeof createMemoryRouter>
}

function createTestRouter(initialEntries: string[]) {
  return createMemoryRouter(
    [
      {
        path: '*',
        element: (
          <ErrorBoundary>
            <AppContent />
          </ErrorBoundary>
        ),
      },
    ],
    { initialEntries },
  )
}

export function renderApp(
  initialEntries: string[] = ['/?page=1'],
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderWithRouterResult {
  const router = createTestRouter(initialEntries)
  const view = render(<RouterProvider router={router} />, options)
  return { router, ...view }
}

export function renderWithSearchParams(
  ui: ReactElement,
  initialEntries: string[] = ['/?page=1'],
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderWithRouterResult {
  const router = createMemoryRouter(
    [{ path: '*', element: ui }],
    { initialEntries },
  )
  const view = render(<RouterProvider router={router} />, options)
  return { router, ...view }
}
