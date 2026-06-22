import { render, type RenderOptions, type RenderResult } from '@testing-library/react'
import mockRouter from 'next-router-mock'
import { MemoryRouterProvider } from 'next-router-mock/MemoryRouterProvider'
import { NextIntlClientProvider } from 'next-intl'
import type { ReactElement } from 'react'
import { Provider } from 'react-redux'

import AppShell from '../components/appShell.tsx'
import type { Theme } from '../context/themeContext.ts'
import { ThemeProvider } from '../context/themeProvider.tsx'
import { setupStore, type AppStore, type RootState } from '../store/store.ts'
import AppRoutesClient from '../testSupport/appRoutesClient.tsx'
import enMessages from '../../messages/en.json'

type RenderWithRouterResult = RenderResult & {
  router: ReturnType<typeof createRouterCompat>
  store: AppStore
}

type RenderAppOptions = Omit<RenderOptions, 'wrapper'> & {
  preloadedState?: Partial<RootState>
  store?: AppStore
  initialTheme?: Theme
  locale?: 'en' | 'ru'
  messages?: Record<string, unknown>
}

const locales = ['en', 'ru'] as const

function stripLocaleFromPath(pathname: string): string {
  for (const locale of locales) {
    if (pathname === `/${locale}`) {
      return '/'
    }
    if (pathname.startsWith(`/${locale}/`)) {
      return pathname.slice(`/${locale}`.length) || '/'
    }
  }
  return pathname
}

function createRouterCompat() {
  return {
    get state() {
      const asPath = mockRouter.asPath
      const queryIndex = asPath.indexOf('?')
      const rawPathname = queryIndex === -1 ? asPath : asPath.slice(0, queryIndex)
      const search = queryIndex === -1 ? '' : asPath.slice(queryIndex)

      return {
        location: {
          pathname: stripLocaleFromPath(rawPathname || '/'),
          search,
        },
      }
    },
  }
}

function IntlTestWrapper({
  children,
  locale = 'en',
  messages = enMessages,
}: {
  children: React.ReactNode
  locale?: 'en' | 'ru'
  messages?: Record<string, unknown>
}) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      {children}
    </NextIntlClientProvider>
  )
}

export function renderApp(
  initialEntries: string[] = ['/?page=1'],
  options?: RenderAppOptions,
): RenderWithRouterResult {
  const {
    preloadedState,
    store: providedStore,
    initialTheme,
    locale = 'en',
    messages = enMessages,
    ...renderOptions
  } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  mockRouter.setCurrentUrl(initialEntries[0])

  const view = render(
    <MemoryRouterProvider>
      <IntlTestWrapper locale={locale} messages={messages}>
        <Provider store={store}>
          <ThemeProvider initialTheme={initialTheme}>
            <AppShell>
              <AppRoutesClient />
            </AppShell>
          </ThemeProvider>
        </Provider>
      </IntlTestWrapper>
    </MemoryRouterProvider>,
    renderOptions,
  )

  return { router: createRouterCompat(), store, ...view }
}

export function renderWithProviders(
  ui: ReactElement,
  options?: RenderAppOptions,
): RenderResult & { store: AppStore } {
  const {
    preloadedState,
    store: providedStore,
    initialTheme,
    locale = 'en',
    messages = enMessages,
    ...renderOptions
  } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  const view = render(
    <IntlTestWrapper locale={locale} messages={messages}>
      <Provider store={store}>
        <ThemeProvider initialTheme={initialTheme}>{ui}</ThemeProvider>
      </Provider>
    </IntlTestWrapper>,
    renderOptions,
  )
  return { store, ...view }
}

export function renderWithSearchParams(
  ui: ReactElement,
  initialEntries: string[] = ['/?page=1'],
  options?: RenderAppOptions,
): RenderWithRouterResult {
  const {
    preloadedState,
    store: providedStore,
    initialTheme,
    locale = 'en',
    messages = enMessages,
    ...renderOptions
  } = options ?? {}
  const store = providedStore ?? setupStore(preloadedState)
  mockRouter.setCurrentUrl(initialEntries[0])

  const view = render(
    <MemoryRouterProvider>
      <IntlTestWrapper locale={locale} messages={messages}>
        <Provider store={store}>
          <ThemeProvider initialTheme={initialTheme}>{ui}</ThemeProvider>
        </Provider>
      </IntlTestWrapper>
    </MemoryRouterProvider>,
    renderOptions,
  )

  return { router: createRouterCompat(), store, ...view }
}
