'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'

import { openPokemonDetailsAction } from '@/actions/pokedex'
import { Link } from '@/i18n/navigation'
import { searchPokemon } from '../../api/pokemon.ts'
import type { PokemonDetails } from '../../types/index.ts'
import { buildHomePath } from '../utils/urlParams.ts'
import '../styles/error-shared.css'
import '../styles/result.css'
import CardList from './cardList.tsx'
import Loading from './Loading.tsx'

type Props = {
  page: number
  query: string
  selectedId: number | null
}

export default function SearchResultsClient({
  page,
  query,
  selectedId,
}: Props) {
  const t = useTranslations('results')
  const [items, setItems] = useState<PokemonDetails[]>([])
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    async function loadResults() {
      setIsLoading(true)
      setErrorMessage(null)

      try {
        const nextItems = await searchPokemon(query, page)
        if (!cancelled) {
          setItems(nextItems)
        }
      } catch (error) {
        if (!cancelled) {
          setItems([])
          setErrorMessage(error instanceof Error ? error.message : t('loadError'))
        }
      } finally {
        if (!cancelled) {
          setIsLoading(false)
        }
      }
    }

    void loadResults()

    return () => {
      cancelled = true
    }
  }, [page, query, t])

  const pagingOn = query.trim() === ''
  const showPagination = pagingOn && !isLoading && !errorMessage

  return (
    <>
      <div className="results-toolbar">
        <h2 className="results-heading">{t('heading')}</h2>
        <button
          type="button"
          className="refresh-button"
          aria-label={t('refreshAria')}
          onClick={() => {
            setIsLoading(true)
            void searchPokemon(query, page)
              .then((nextItems) => {
                setItems(nextItems)
                setErrorMessage(null)
              })
              .catch((error: unknown) => {
                setItems([])
                setErrorMessage(error instanceof Error ? error.message : t('loadError'))
              })
              .finally(() => {
                setIsLoading(false)
              })
          }}
        >
          {t('refresh')}
        </button>
      </div>

      {showPagination && (
        <div className="pagination">
          {page > 1 ? (
            <Link href={buildHomePath(page - 1, null, query)}>{t('previous')}</Link>
          ) : (
            <button type="button" disabled>
              {t('previous')}
            </button>
          )}
          <span className="page-number">{t('page', { page })}</span>
          <Link href={buildHomePath(page + 1, null, query)}>{t('next')}</Link>
        </div>
      )}

      {isLoading ? (
        <Loading />
      ) : errorMessage ? (
        <div className="error-panel">{errorMessage}</div>
      ) : items.length === 0 ? (
        <p className="no-results">{t('noResults')}</p>
      ) : (
        <CardList
          items={items}
          detailsOpenId={selectedId}
          page={page}
          query={query}
          openDetailsAction={openPokemonDetailsAction}
        />
      )}
    </>
  )
}
