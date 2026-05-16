import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import PokemonDetailsPanel from './components/pokemonDetailsPanel.tsx'
import HomePage from './pages/HomePage.tsx'

export const routes: RouteObject[] = [
  {
    path: '/',
    element: <HomePage />,
    children: [
      {
        path: 'details',
        element: <PokemonDetailsPanel />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
