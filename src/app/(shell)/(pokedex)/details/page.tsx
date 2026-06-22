import { Suspense } from 'react'

import PokemonDetailsPanel from '@/components/pokemonDetailsPanel.tsx'

export default function DetailsPage() {
  return (
    <Suspense fallback={null}>
      <PokemonDetailsPanel />
    </Suspense>
  )
}
