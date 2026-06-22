import { Suspense } from 'react'
import { setRequestLocale } from 'next-intl/server'

import PokemonDetailsPanel from '@/components/pokemonDetailsPanel'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function DetailsPage({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return (
    <Suspense fallback={null}>
      <PokemonDetailsPanel />
    </Suspense>
  )
}
