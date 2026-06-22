import type { Metadata } from 'next'

import AppRoot from '@/providers/appRoot.tsx'
import '@/styles/global.css'

export const metadata: Metadata = {
  title: 'Pokedex',
  description: 'Browse and search Pokémon using the public PokeAPI',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        <AppRoot>{children}</AppRoot>
      </body>
    </html>
  )
}
