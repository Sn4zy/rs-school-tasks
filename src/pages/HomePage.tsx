import { useState } from 'react'

import Layout from '../components/layout.tsx'

export default function HomePage() {
  const [committedQuery, setCommittedQuery] = useState('')

  return <Layout committedQuery={committedQuery} onCommitSearch={setCommittedQuery} />
}
