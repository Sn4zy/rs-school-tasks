import { Component } from 'react'
import ErrorThrower from './errorThrower.tsx'
import Header from './header.tsx'
import Result from './result.tsx'
import Search from './search.tsx'

interface Props {
  committedQuery: string
  onCommitSearch: (trimmed: string) => void
}

class Layout extends Component<Props> {
  render() {
    const { committedQuery, onCommitSearch } = this.props

    return (
      <main className="main-page">
        <Header />

        <section className="search-area">
          <h2 className="search-area-heading">Search</h2>
          <Search committedQuery={committedQuery} onCommittedSearch={onCommitSearch} />
        </section>

        <Result query={committedQuery} />

        <div className="debug-error-row">
          <ErrorThrower />
        </div>
      </main>
    )
  }
}

export default Layout
