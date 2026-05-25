import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'
import { createMemoryRouter, RouterProvider } from 'react-router-dom'

import ErrorBoundary from '../components/errorBoundary.tsx'
import type { Theme } from '../context/themeContext.ts'
import { ThemeProvider } from '../context/themeProvider.tsx'
import { routes } from '../router.tsx'
import { setupStore, type AppStore, type RootState } from '../store/store.ts'

type RenderWithRouterResult = RenderResult & {
  router: ReturnType<typeof createMemoryRouter>
  store: AppStore
}

type RenderAppOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: Partial<RootState>
  store?: AppStore
  initialTheme?: Theme
}

export function renderApp(
  initialEntries: string[] = ['/?page=1'],
  options?: RenderAppOptions,
): RenderWithRouterResult {
  const { preloadedState, store: providedStore, initialTheme, ...renderOptions } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  const router = createMemoryRouter(routes, { initialEntries })
  const view = render(
    <Provider store={store}>
      <ThemeProvider initialTheme={initialTheme}>
        <ErrorBoundary>
          <RouterProvider router={router} />
        </ErrorBoundary>
      </ThemeProvider>
    </Provider>,
    renderOptions,
  )
  return { router, store, ...view }
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderAppOptions,
): RenderResult & { store: AppStore } {
  const { preloadedState, store: providedStore, initialTheme, ...renderOptions } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  const view = render(
    <Provider store={store}>
      <ThemeProvider initialTheme={initialTheme}>{ui}</ThemeProvider>
    </Provider>,
    renderOptions,
  )
  return { store, ...view }
}

export function renderWithSearchParams(
  ui: ReactElement,
  initialEntries: string[] = ['/?page=1'],
  options?: RenderAppOptions,
): RenderWithRouterResult {
  const { preloadedState, store: providedStore, initialTheme, ...renderOptions } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  const router = createMemoryRouter(
    [{ path: '*', element: ui }],
    { initialEntries },
  )
  const view = render(
    <Provider store={store}>
      <ThemeProvider initialTheme={initialTheme}>
        <RouterProvider router={router} />
      </ThemeProvider>
    </Provider>,
    renderOptions,
  )
  return { router, store, ...view }
}
