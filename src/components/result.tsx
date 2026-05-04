import { Component } from 'react'
import type { PokemonDetails } from '../../types/index.ts'
import CardList from './cardList.tsx'
import Loading from './Loading.tsx'
import { searchPokemon } from '../../api/pokemon.ts'

interface Props {
  query?: string
}

interface State {
  items: PokemonDetails[]
  loading: boolean
  error: string | null
  page: number
}

function trim(value: string | undefined) {
  return (value ?? '').trim()
}

class Result extends Component<Props, State> {
  state: State = {
    items: [],
    loading: true,
    error: null,
    page: 1,
  }

  componentDidMount() {
    this.loadData(1)
  }

  componentDidUpdate(prevProps: Props) {
    if (trim(prevProps.query) !== trim(this.props.query)) {
      this.loadData(1)
    }
  }

  loadData(page: number) {
    this.setState({ loading: true, error: null, page })

    searchPokemon(trim(this.props.query), page)
      .then((items) => this.setState({ items, loading: false }))
      .catch((err: unknown) =>
        this.setState({
          loading: false,
          error: err instanceof Error ? err.message : 'Could not load data.',
        }),
      )
  }

  render() {
    const { items, loading, error, page } = this.state
    const pagingOn = trim(this.props.query) === ''

    return (
      <section className="results-area">
        <h2 className="results-heading">Results</h2>

        {pagingOn && (
          <div className="pagination">
            <button type="button" disabled={loading || page <= 1} onClick={() => this.loadData(page - 1)}>
              Previous
            </button>
            <span className="page-number">Page {page}</span>
            <button type="button" disabled={loading} onClick={() => this.loadData(page + 1)}>
              Next
            </button>
          </div>
        )}

        {loading ? (
          <Loading />
        ) : error ? (
          <div className="error-panel">{error}</div>
        ) : items.length === 0 ? (
          <p className="no-results">No items found.</p>
        ) : (
          <CardList items={items} />
        )}
      </section>
    )
  }
}

export default Result
