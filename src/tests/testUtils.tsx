import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import ErrorBoundary from '../components/errorBoundary.tsx'
import { routes } from '../router.tsx'

type RenderWithRouterResult = RenderResult & {
  router: ReturnType<typeof createMemoryRouter>
}

export function renderApp(
  initialEntries: string[] = ['/?page=1'],
  options?: Omit<RenderOptions, 'wrapper'>,
): RenderWithRouterResult {
  const router = createMemoryRouter(routes, { initialEntries })
  const view = render(
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>,
    options,
  )
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
