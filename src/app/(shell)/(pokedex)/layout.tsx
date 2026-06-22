import { Suspense, type ReactNode } from 'react'

import PokedexLayoutClient from './pokedexLayoutClient.tsx'

type Props = {
  children: ReactNode
}

export default function PokedexLayout({ children }: Props) {
  return (
    <Suspense fallback={null}>
      <PokedexLayoutClient>{children}</PokedexLayoutClient>
    </Suspense>
  )
}
