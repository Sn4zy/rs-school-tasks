import { Component, type ChangeEvent } from 'react'

import { readStoredSearch, SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'

interface Props {
 
  committedQuery: string

  onCommittedSearch: (trimmed: string) => void
}

interface State {
  draft: string
}

class Search extends Component<Props, State> {
  constructor(props: Props) {
    super(props)
    this.state = { draft: props.committedQuery }
  }

  componentDidMount() {
    const fromStorage = readStoredSearch()
    this.setState({ draft: fromStorage })
    if (fromStorage.trim() !== this.props.committedQuery.trim()) {
      this.props.onCommittedSearch(fromStorage.trim())
    }
  }

  handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    this.setState({ draft: e.target.value })
  }

  handleSearchClick = () => {
    const trimmed = this.state.draft.trim()

    if (trimmed === this.props.committedQuery.trim()) {
      return
    }

    try {
      localStorage.setItem(SEARCH_STORAGE_KEY, trimmed)
    } catch {
      // ignore localStorage failures (private mode / quota)
    }

    this.props.onCommittedSearch(trimmed)
  }

  render() {
    return (
      <div className="search-controls">
        <label className="search-label" htmlFor="pokemon-search-input">
          Pokémon name (exact match)
        </label>
        <div className="search-row">
          <input
            id="pokemon-search-input"
            type="text"
            className="search-input"
            value={this.state.draft}
            onChange={this.handleChange}
            placeholder="Leave empty for list, or e.g. pikachu"
            autoComplete="off"
          />
          <button type="button" className="search-button" onClick={this.handleSearchClick}>
            Search
          </button>
        </div>
      </div>
    )
  }
}

export default Search
