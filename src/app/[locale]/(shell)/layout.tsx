'use client'

import AppShell from '@/components/appShell.tsx'

type Props = {
  children: React.ReactNode
}

export default function ShellLayout({ children }: Props) {
  return <AppShell>{children}</AppShell>
}
