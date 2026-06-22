'use client'

import type { ReactNode } from 'react'

import '../styles/appShell.css'
import Header from './header.tsx'
import SelectedItemsFlyout from './selectedItemsFlyout.tsx'

type Props = {
  children: ReactNode
}

export default function AppShell({ children }: Props) {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">{children}</div>
      <SelectedItemsFlyout />
    </div>
  )
}
