import ErrorThrower from './errorThrower.tsx'
import Header from './header.tsx'
import Result from './result.tsx'
import Search from './search.tsx'

interface Props {
  committedQuery: string
  onCommitSearch: (trimmed: string) => void
}

export default function Layout({ committedQuery, onCommitSearch }: Props) {
  return (
    <main className="main-page">
      <Header />

      <section className="search-area">
        <h2 className="search-area-heading">Search</h2>
        <Search committedQuery={committedQuery} onCommittedSearch={onCommitSearch} />
      </section>

      <Result key={committedQuery} query={committedQuery} />

      <div className="debug-error-row">
        <ErrorThrower />
      </div>
    </main>
  )
}
