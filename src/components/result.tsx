import { useCallback, useEffect, useState } from 'react'

import { searchPokemon } from '../../api/pokemon.ts'
import type { PokemonDetails } from '../../types/index.ts'
import CardList from './cardList.tsx'
import Loading from './Loading.tsx'

interface Props {
  query?: string
}

function trim(value: string | undefined) {
  return (value ?? '').trim()
}

export default function Result({ query }: Props) {
  const [items, setItems] = useState<PokemonDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [page, setPage] = useState(1)

  const normalizedQuery = trim(query)
  const pagingOn = normalizedQuery === ''

  useEffect(() => {
    let cancelled = false

    searchPokemon(normalizedQuery, 1)
      .then((data) => {
        if (!cancelled) {
          setItems(data)
          setPage(1)
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
  }, [normalizedQuery])

  const loadPage = useCallback(
    (nextPage: number) => {
      setLoading(true)
      setError(null)
      setPage(nextPage)

      searchPokemon(normalizedQuery, nextPage)
        .then((data) => {
          setItems(data)
          setLoading(false)
        })
        .catch((err: unknown) => {
          setLoading(false)
          setError(err instanceof Error ? err.message : 'Could not load data.')
        })
    },
    [normalizedQuery],
  )

  return (
    <section className="results-area">
      <h2 className="results-heading">Results</h2>

      {pagingOn && (
        <div className="pagination">
          <button
            type="button"
            disabled={loading || page <= 1}
            onClick={() => loadPage(page - 1)}
          >
            Previous
          </button>
          <span className="page-number">Page {page}</span>
          <button type="button" disabled={loading} onClick={() => loadPage(page + 1)}>
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
