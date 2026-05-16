import { useCallback, useEffect } from 'react'
import { useSearchParams } from 'react-router-dom'

import { parsePageParam } from '../utils/urlParams.ts'
import ErrorThrower from './errorThrower.tsx'
import Header from './header.tsx'
import Result from './result.tsx'
import Search from './search.tsx'

interface Props {
  committedQuery: string
  onCommitSearch: (trimmed: string) => void
}

export default function Layout({ committedQuery, onCommitSearch }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePageParam(searchParams.get('page'))

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams({ page: '1' }, { replace: true })
    }
  }, [searchParams, setSearchParams])

  const commitSearch = useCallback(
    (trimmed: string) => {
      onCommitSearch(trimmed)
      setSearchParams({ page: '1' })
    },
    [onCommitSearch, setSearchParams],
  )

  return (
    <main className="main-page">
      <Header />

      <section className="search-area">
        <h2 className="search-area-heading">Search</h2>
        <Search committedQuery={committedQuery} onCommittedSearch={commitSearch} />
      </section>

      <Result key={`${committedQuery}-${page}`} query={committedQuery} />

      <div className="debug-error-row">
        <ErrorThrower />
      </div>
    </main>
  )
}
