'use client'

import AboutPageClient from '@/views/AboutPageClient'
import NotFoundPageClient from '@/views/NotFoundPageClient'
import PokedexShellClient from '@/components/pokedexShellClient'
import PokemonDetailsPanelClient from '@/components/pokemonDetailsPanelClient'
import { usePathname } from '@/i18n/navigation'

export default function AppRoutesClient() {
  const pathname = usePathname()

  if (pathname === '/about') {
    return <AboutPageClient />
  }

  if (pathname === '/details') {
    return (
      <PokedexShellClient>
        <PokemonDetailsPanelClient />
      </PokedexShellClient>
    )
  }

  if (pathname === '/') {
    return <PokedexShellClient>{null}</PokedexShellClient>
  }

  return <NotFoundPageClient />
}
