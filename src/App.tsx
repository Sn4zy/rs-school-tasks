import { Component } from 'react'
import './App.css'
import Result from './components/result.tsx'
import Search from './components/search.tsx'
import { readStoredSearch } from './utils/searchStorage.ts'

interface AppState {
  committedQuery: string
}

class App extends Component<Record<string, never>, AppState> {
  state: AppState = {
    committedQuery: readStoredSearch(),
  }

  commitSearch = (trimmed: string) => {
    this.setState({ committedQuery: trimmed })
  }

  render() {
    const { committedQuery } = this.state

    return (
      <main className="main-page">
        <h1>Pokedex</h1>

        <section className="search-area">
          <h2 className="search-area-heading">Search</h2>
          <Search committedQuery={committedQuery} onCommittedSearch={this.commitSearch} />
        </section>

        <Result query={committedQuery} />
      </main>
    )
  }
}

export default App
