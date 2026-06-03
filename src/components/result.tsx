import { useSearchParams } from 'react-router-dom'

import { useSearchPokemonQuery } from '../api/pokemonApi.ts'
import { getReadableQueryError } from '../utils/rtkQueryError.ts'
import { parsePageParam } from '../utils/urlParams.ts'
import '../styles/error-shared.css'
import '../styles/result.css'
import CardList from './cardList.tsx'
import Loading from './Loading.tsx'

interface Props {
  query?: string
  selectedId: number | null
  onSelectPokemon: (id: number) => void
}

function trim(value: string | undefined) {
  return (value ?? '').trim()
}

export default function Result({ query, selectedId, onSelectPokemon }: Props) {
  const [searchParams, setSearchParams] = useSearchParams()
  const page = parsePageParam(searchParams.get('page'))

  const normalizedQuery = trim(query)
  const pagingOn = normalizedQuery === ''

  const { data: items, isLoading, isFetching, error } = useSearchPokemonQuery({
    query: normalizedQuery,
    page,
  })

  const goToPage = (nextPage: number) => {
    const nextParams: Record<string, string> = { page: String(nextPage) }
    const details = searchParams.get('details')
    if (details) {
      nextParams.details = details
    }
    setSearchParams(nextParams)
  }

  const isBusy = isLoading || isFetching
  const errorMessage = getReadableQueryError(error, 'Could not load data.')

  const showPagination = pagingOn && !isBusy && !errorMessage

  return (
    <>
      <h2 className="results-heading">Results</h2>

      {showPagination && (
        <div className="pagination">
          <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            Previous
          </button>
          <span className="page-number">Page {page}</span>
          <button type="button" onClick={() => goToPage(page + 1)}>
            Next
          </button>
        </div>
      )}

      {isBusy ? (
        <Loading />
      ) : errorMessage ? (
        <div className="error-panel">{errorMessage}</div>
      ) : !items || items.length === 0 ? (
        <p className="no-results">No items found.</p>
      ) : (
        <CardList
          items={items}
          detailsOpenId={selectedId}
          onOpenDetails={onSelectPokemon}
        />
      )}
    </>
  )
}
