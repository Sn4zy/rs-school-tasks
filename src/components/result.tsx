import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

import { searchPokemon } from '../../api/pokemon.ts'
import type { PokemonDetails } from '../../types/index.ts'
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

  const [items, setItems] = useState<PokemonDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const normalizedQuery = trim(query)
  const pagingOn = normalizedQuery === ''

  useEffect(() => {
    let cancelled = false

    searchPokemon(normalizedQuery, page)
      .then((data) => {
        if (!cancelled) {
          setItems(data)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoading(false)
          setError(err instanceof Error ? err.message : 'Could not load data.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [normalizedQuery, page])

  const goToPage = (nextPage: number) => {
    const nextParams: Record<string, string> = { page: String(nextPage) }
    const details = searchParams.get('details')
    if (details) {
      nextParams.details = details
    }
    setSearchParams(nextParams)
  }

  const showPagination = pagingOn && !loading && !error

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

      {loading ? (
        <Loading />
      ) : error ? (
        <div className="error-panel">{error}</div>
      ) : items.length === 0 ? (
        <p className="no-results">No items found.</p>
      ) : (
        <CardList items={items} selectedId={selectedId} onSelectPokemon={onSelectPokemon} />
      )}
    </>
  )
}
