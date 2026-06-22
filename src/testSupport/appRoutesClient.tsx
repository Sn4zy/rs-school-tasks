'use client'

import { usePathname } from 'next/navigation'

import PokedexLayoutClient from '@/app/(shell)/(pokedex)/pokedexLayoutClient.tsx'
import PokemonDetailsPanel from '@/components/pokemonDetailsPanel.tsx'
import AboutPage from '@/views/AboutPage.tsx'
import NotFoundPage from '@/views/NotFoundPage.tsx'

export default function AppRoutesClient() {
  const pathname = usePathname()

  if (pathname === '/about') {
    return <AboutPage />
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

  return <NotFoundPage />
}
