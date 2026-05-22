import { RouterProvider } from 'react-router-dom'

import ErrorBoundary from './components/errorBoundary.tsx'
import { router } from './router.tsx'

export default function App() {
  return (
    <ErrorBoundary>
      <RouterProvider router={router} />
    </ErrorBoundary>
  )
}
