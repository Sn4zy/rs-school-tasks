import { RouterProvider } from 'react-router-dom'

import ErrorBoundary from './components/errorBoundary.tsx'
import AppProviders from './providers/appProviders.tsx'
import { router } from './router.tsx'

export default function App() {
  return (
    <AppProviders>
      <ErrorBoundary>
        <RouterProvider router={router} />
      </ErrorBoundary>
    </AppProviders>
  )
}
