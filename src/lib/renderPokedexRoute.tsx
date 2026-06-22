import type { ReactNode } from 'react'

import { getTranslations, setRequestLocale } from 'next-intl/server'

import { loadPokedexSearchResults } from '@/lib/pokedexSearch'
import PokedexShell from '@/views/PokedexShell'
import { parsePageParam, parseQueryParam } from '@/utils/urlParams'

type SearchParams = Record<string, string | string[] | undefined>

function readSearchParam(value: string | string[] | undefined): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }
  return value ?? null
}

type Options = {
  locale: string
  searchParams: SearchParams
  detailsPanel: ReactNode
  showDetailsPanel: boolean
}

export async function renderPokedexRoute({
  locale,
  searchParams,
  detailsPanel,
  showDetailsPanel,
}: Options) {
  setRequestLocale(locale)
  const page = parsePageParam(readSearchParam(searchParams.page))
  const query = parseQueryParam(readSearchParam(searchParams.q))
  const detailsParam = readSearchParam(searchParams.details)
  const selectedId =
    detailsParam !== null && detailsParam !== ''
      ? Number.parseInt(detailsParam, 10)
      : null
  const t = await getTranslations('results')
  const { items, errorMessage } = await loadPokedexSearchResults(
    query,
    page,
    t('loadError'),
  )

  return (
    <PokedexShell
      locale={locale}
      items={items}
      errorMessage={errorMessage}
      page={page}
      query={query}
      selectedId={Number.isNaN(selectedId) ? null : selectedId}
      showDetailsPanel={showDetailsPanel}
    >
      {detailsPanel}
    </PokedexShell>
  )
}
