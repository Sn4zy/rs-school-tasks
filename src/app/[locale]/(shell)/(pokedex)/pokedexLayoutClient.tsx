'use client'

import { useState, type ReactNode } from 'react'

import Layout from '@/components/layout.tsx'
import PokedexErrorBoundary from '@/components/pokedexErrorBoundary.tsx'

type Props = {
  children: ReactNode
}

export default function PokedexLayoutClient({ children }: Props) {
  const [committedQuery, setCommittedQuery] = useState('')

  return (
    <PokedexErrorBoundary>
      <Layout committedQuery={committedQuery} onCommitSearch={setCommittedQuery}>
        {children}
      </Layout>
    </PokedexErrorBoundary>
  )
}
