import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { ThemeProvider } from '../context/themeProvider.tsx'
import { store } from '../store/store.ts'

type Props = {
  children: ReactNode
}

export default function AppProviders({ children }: Props) {
  return (
    <Provider store={store}>
      <ThemeProvider>{children}</ThemeProvider>
    </Provider>
  )
}
