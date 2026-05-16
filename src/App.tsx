import { useState } from 'react'

import './App.css'
import ErrorBoundary from './components/errorBoundary.tsx'
import Layout from './components/layout.tsx'

export default function App() {
  const [committedQuery, setCommittedQuery] = useState('')

  return (
    <ErrorBoundary>
      <Layout committedQuery={committedQuery} onCommitSearch={setCommittedQuery} />
    </ErrorBoundary>
  )
}
