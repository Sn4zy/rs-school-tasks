import { getTranslations, setRequestLocale } from 'next-intl/server'

import { refreshSearchAction, openPokemonDetailsAction } from '@/actions/pokedex'
import { Link } from '@/i18n/navigation'
import type { PokemonDetails } from '../../types/index.ts'
import { buildHomePath } from '../utils/urlParams.ts'
import '../styles/error-shared.css'
import '../styles/result.css'
import CardList from './cardList.tsx'

type Props = {
  locale: string
  items: PokemonDetails[]
  errorMessage: string | null
  page: number
  query: string
  selectedId: number | null
}

export default async function SearchResults({
  locale,
  items,
  errorMessage,
  page,
  query,
  selectedId,
}: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('results')
  const pagingOn = query.trim() === ''
  const showPagination = pagingOn && !errorMessage

  return (
    <>
      <div className="results-toolbar">
        <h2 className="results-heading">{t('heading')}</h2>
        <form action={refreshSearchAction}>
          <button type="submit" className="refresh-button" aria-label={t('refreshAria')}>
            {t('refresh')}
          </button>
        </form>
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

      {errorMessage ? (
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
