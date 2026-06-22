'use client'

import type { ReactNode } from 'react'

import { ThemeProvider } from '../context/themeProvider.tsx'
import StoreProvider from './storeProvider.tsx'

type Props = {
  children: ReactNode
}

export default function AppProviders({ children }: Props) {
  return (
    <StoreProvider>
      <ThemeProvider>{children}</ThemeProvider>
    </StoreProvider>
  )
}
