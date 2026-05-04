import { Component } from 'react'
import './App.css'
import ErrorBoundary from './components/errorBoundary.tsx'
import Layout from './components/layout.tsx'
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
      <ErrorBoundary>
        <Layout committedQuery={committedQuery} onCommitSearch={this.commitSearch} />
      </ErrorBoundary>
    )
  }
}

export default App
