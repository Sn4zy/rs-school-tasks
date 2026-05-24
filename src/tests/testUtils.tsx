import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import ErrorBoundary from '../components/errorBoundary.tsx'
import AppProviders from '../providers/appProviders.tsx'
import { routes } from '../router.tsx'
import { setupStore, type AppStore, type RootState } from '../store/store.ts'

type RenderWithRouterResult = RenderResult & {
  router: ReturnType<typeof createMemoryRouter>
  store: AppStore
}

type RenderAppOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: Partial<RootState>
  store?: AppStore
}

export function renderApp(
  initialEntries: string[] = ['/?page=1'],
  options?: RenderAppOptions,
): RenderWithRouterResult {
  const { preloadedState, store: providedStore, ...renderOptions } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  const router = createMemoryRouter(routes, { initialEntries })
  const view = render(
    <Provider store={store}>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </Provider>,
    renderOptions,
  )
  return { router, store, ...view }
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderAppOptions,
): RenderResult & { store: AppStore } {
  const { preloadedState, store: providedStore, ...renderOptions } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  const view = render(<AppProviders>{ui}</AppProviders>, renderOptions)
  return { store, ...view }
}

export function renderWithSearchParams(
  ui: ReactElement,
  initialEntries: string[] = ['/?page=1'],
  options?: RenderAppOptions,
): RenderWithRouterResult {
  const { preloadedState, store: providedStore, ...renderOptions } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  const router = createMemoryRouter(
    [{ path: '*', element: ui }],
    { initialEntries },
  )
  const view = render(
    <Provider store={store}>
      <RouterProvider router={router} />
    </Provider>,
    renderOptions,
  )
  return { router, store, ...view }
}
