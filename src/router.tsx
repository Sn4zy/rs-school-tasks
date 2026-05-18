import { createBrowserRouter, type RouteObject } from 'react-router-dom'

import PokemonDetailsPanel from './components/pokemonDetailsPanel.tsx'
import RouteErrorFallback from './components/routeErrorFallback.tsx'
import AboutPage from './pages/AboutPage.tsx'
import HomePage from './pages/HomePage.tsx'
import NotFoundPage from './pages/NotFoundPage.tsx'

export const routes: RouteObject[] = [
  {
    errorElement: <RouteErrorFallback />,
    children: [
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
      {
        path: '/about',
        element: <AboutPage />,
      },
      {
        path: '*',
        element: <NotFoundPage />,
      },
    ],
  },
]

export const router = createBrowserRouter(routes)
