'use client'

import { useTranslations } from 'next-intl'
import { useCallback, type ReactNode } from 'react'
import { useSearchParams } from 'next/navigation'

import { closePokemonDetailsAction } from '@/actions/pokedex'
import { usePathname } from '@/i18n/navigation'
import PokedexErrorBoundary from '@/components/pokedexErrorBoundary'
import SearchForm from '@/components/searchForm'
import SearchResultsClient from '@/components/searchResultsClient'
import PokedexBackdropHandler from '@/components/pokedexBackdropHandler'
import ErrorThrower from '@/components/errorThrower'
import { parsePageParam, parseQueryParam } from '@/utils/urlParams'
import '../styles/layout.css'

type Props = {
  children: ReactNode
}

export default function PokedexShellClient({ children }: Props) {
  const t = useTranslations('search')
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = parsePageParam(searchParams?.get('page') ?? null)
  const query = parseQueryParam(searchParams?.get('q') ?? null)
  const detailsParam = searchParams?.get('details') ?? null
  const selectedId =
    detailsParam !== null && detailsParam !== ''
      ? Number.parseInt(detailsParam, 10)
      : null
  const showDetailsPanel =
    pathname === '/details' &&
    selectedId !== null &&
    !Number.isNaN(selectedId)

  const handleBackdropClose = useCallback(() => {
    const formData = new FormData()
    formData.set('page', String(page))
    formData.set('q', query)
    void closePokemonDetailsAction(formData)
  }, [page, query])

  return (
    <PokedexErrorBoundary>
      <PokedexBackdropHandler
      showDetailsPanel={showDetailsPanel}
      page={page}
      query={query}
      onBackdropClose={handleBackdropClose}
    >
      <section className="search-area">
        <h2 className="search-area-heading">{t('heading')}</h2>
        <SearchForm query={query} />
      </section>

      <div className={`master-detail${showDetailsPanel ? ' master-detail--split' : ''}`}>
        <section className="results-area results-area--list">
          <SearchResultsClient
            page={page}
            query={query}
            selectedId={showDetailsPanel ? selectedId : null}
          />
        </section>

        <section
          className="results-area results-area--details"
          aria-hidden={!showDetailsPanel && !children}
        >
          {showDetailsPanel ? children : <div className="details-panel-placeholder" aria-hidden="true" />}
        </section>
      </div>

      <div className="debug-error-row">
        <ErrorThrower />
      </div>
    </PokedexBackdropHandler>
    </PokedexErrorBoundary>
  )
}
