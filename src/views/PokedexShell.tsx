import { getTranslations, setRequestLocale } from 'next-intl/server'
import type { ReactNode } from 'react'

import SearchForm from '@/components/searchForm'
import SearchResults from '@/components/searchResults'
import PokedexBackdropHandler from '@/components/pokedexBackdropHandler'
import type { PokemonDetails } from '../../types/index.ts'
import '../styles/layout.css'

type Props = {
  locale: string
  items: PokemonDetails[]
  errorMessage: string | null
  page: number
  query: string
  selectedId: number | null
  showDetailsPanel: boolean
  children: ReactNode
}

export default async function PokedexShell({
  locale,
  items,
  errorMessage,
  page,
  query,
  selectedId,
  showDetailsPanel,
  children,
}: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('search')

  return (
      <PokedexBackdropHandler
        showDetailsPanel={showDetailsPanel}
        page={page}
        query={query}
      >
      <section className="search-area">
        <h2 className="search-area-heading">{t('heading')}</h2>
        <SearchForm query={query} />
      </section>

      <div className={`master-detail${showDetailsPanel ? ' master-detail--split' : ''}`}>
        <section className="results-area results-area--list">
          <SearchResults
            locale={locale}
            items={items}
            errorMessage={errorMessage}
            page={page}
            query={query}
            selectedId={showDetailsPanel ? selectedId : null}
          />
        </section>

        <section
          className="results-area results-area--details"
          aria-hidden={!showDetailsPanel && !children}
        >
          {children ?? <div className="details-panel-placeholder" aria-hidden="true" />}
        </section>
      </div>
    </PokedexBackdropHandler>
  )
}
