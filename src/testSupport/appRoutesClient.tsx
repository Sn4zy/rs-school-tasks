'use client'

import AboutPageClient from '@/views/AboutPageClient'
import NotFoundPageClient from '@/views/NotFoundPageClient'
import PokedexLayoutClient from '@/app/[locale]/(shell)/(pokedex)/pokedexLayoutClient'
import PokemonDetailsPanel from '@/components/pokemonDetailsPanel'
import { usePathname } from '@/i18n/navigation'

export default function AppRoutesClient() {
  const pathname = usePathname()

  if (pathname === '/about') {
    return <AboutPageClient />
  }

  if (pathname === '/details') {
    return (
      <PokedexLayoutClient>
        <PokemonDetailsPanel />
      </PokedexLayoutClient>
    )
  }

  if (pathname === '/') {
    return <PokedexLayoutClient>{null}</PokedexLayoutClient>
  }

  return <NotFoundPageClient />
}
