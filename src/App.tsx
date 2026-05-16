import { useState } from 'react'
import { BrowserRouter } from 'react-router-dom'

import './App.css'
import ErrorBoundary from './components/errorBoundary.tsx'
import Layout from './components/layout.tsx'

export function AppContent() {
  const [committedQuery, setCommittedQuery] = useState('')

  return <Layout committedQuery={committedQuery} onCommitSearch={setCommittedQuery} />
}

export default function App() {
  return (
    <ErrorBoundary>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </ErrorBoundary>
  )
}
