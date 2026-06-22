'use client'

import type { ReactNode } from 'react'

import AppProviders from './appProviders.tsx'

type Props = {
  children: ReactNode
}

export default function AppRoot({ children }: Props) {
  return <AppProviders>{children}</AppProviders>
}
