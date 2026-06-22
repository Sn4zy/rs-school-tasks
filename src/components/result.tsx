'use client'

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import {
  pokemonApi,
  pokemonListCacheTag,
  useSearchPokemonQuery,
  type SearchPokemonArg,
} from '../api/pokemonApi.ts'
import { usePathname, useRouter } from '@/i18n/navigation.ts'
import { useAppDispatch } from '../store/hooks.ts'
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
  const t = useTranslations('results')
  const errorsT = useTranslations('errors')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = parsePageParam(searchParams?.get('page') ?? null)

  const normalizedQuery = trim(query)
  const pagingOn = normalizedQuery === ''
  const searchArg: SearchPokemonArg = { query: normalizedQuery, page }

  const { data: items, isLoading, isFetching, error, refetch } = useSearchPokemonQuery(searchArg)

  const refreshResults = () => {
    dispatch(pokemonApi.util.invalidateTags([pokemonListCacheTag(searchArg)]))
    void refetch()
  }

  const goToPage = (nextPage: number) => {
    const params = new URLSearchParams(searchParams?.toString() ?? '')
    params.set('page', String(nextPage))
    router.push(`${pathname}?${params.toString()}`)
  }

  const isBusy = isLoading || isFetching
  const errorMessage = getReadableQueryError(error, t('loadError'), {
    network: errorsT('network'),
    invalidResponse: errorsT('invalidResponse'),
    timeout: errorsT('timeout'),
    httpStatus: (message, status) => errorsT('httpStatus', { message, status }),
  })

  const showPagination = pagingOn && !isBusy && !errorMessage

  return (
    <>
      <div className="results-toolbar">
        <h2 className="results-heading">{t('heading')}</h2>
        <button
          type="button"
          className="refresh-button"
          aria-label={t('refreshAria')}
          onClick={refreshResults}
        >
          {t('refresh')}
        </button>
      </div>

      {showPagination && (
        <div className="pagination">
          <button type="button" disabled={page <= 1} onClick={() => goToPage(page - 1)}>
            {t('previous')}
          </button>
          <span className="page-number">{t('page', { page })}</span>
          <button type="button" onClick={() => goToPage(page + 1)}>
            {t('next')}
          </button>
        </div>
      )}

      {isBusy ? (
        <Loading />
      ) : errorMessage ? (
        <div className="error-panel">{errorMessage}</div>
      ) : !items || items.length === 0 ? (
        <p className="no-results">{t('noResults')}</p>
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
