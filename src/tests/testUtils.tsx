import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'

import AppShell from '../components/appShell.tsx'
import type { Theme } from '../context/themeContext.ts'
import { ThemeProvider } from '../context/themeProvider.tsx'
import { setupStore, type AppStore, type RootState } from '../store/store.ts'
import AppRoutesClient from '../testSupport/appRoutesClient.tsx'

type RenderWithRouterResult = RenderResult & {
  router: ReturnType<typeof createRouterCompat>
  store: AppStore
}

type RenderAppOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: Partial<RootState>
  store?: AppStore
  initialTheme?: Theme
}

function createRouterCompat() {
  return {
    get state() {
      const asPath = mockRouter.asPath
      const queryIndex = asPath.indexOf('?')
      const pathname = queryIndex === -1 ? asPath : asPath.slice(0, queryIndex)
      const search = queryIndex === -1 ? '' : asPath.slice(queryIndex)

      return {
        location: {
          pathname: pathname || '/',
          search,
        },
      }
    },
  }
}

export function renderApp(
  initialEntries: string[] = ['/?page=1'],
  options?: RenderAppOptions,
): RenderWithRouterResult {
  const { preloadedState, store: providedStore, initialTheme, ...renderOptions } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  mockRouter.setCurrentUrl(initialEntries[0])

  const view = render(
    <MemoryRouterProvider>
      <Provider store={store}>
        <ThemeProvider initialTheme={initialTheme}>
          <AppShell>
            <AppRoutesClient />
          </AppShell>
        </ThemeProvider>
      </Provider>
    </MemoryRouterProvider>,
    renderOptions,
  )

  return { router: createRouterCompat(), store, ...view }
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
  mockRouter.setCurrentUrl(initialEntries[0])

  const view = render(
    <MemoryRouterProvider>
      <Provider store={store}>
        <ThemeProvider initialTheme={initialTheme}>{ui}</ThemeProvider>
      </Provider>
    </MemoryRouterProvider>,
    renderOptions,
  )

  return { router: createRouterCompat(), store, ...view }
}
