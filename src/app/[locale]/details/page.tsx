import { getTranslations, setRequestLocale } from 'next-intl/server'

import { redirect } from '@/i18n/navigation'
import { fetchPokemonDetails } from '../../../../api/pokemon.ts'
import { renderPokedexRoute } from '@/lib/renderPokedexRoute'
import PokemonDetailsPanelView from '@/views/PokemonDetailsPanelView'
import { buildHomePath, parsePageParam, parseQueryParam } from '@/utils/urlParams'
import type { PokemonDetails } from '../../../../types/index.ts'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

function readSearchParam(
  value: string | string[] | undefined,
): string | null {
  if (Array.isArray(value)) {
    return value[0] ?? null
  }
  return value ?? null
}

async function loadPokemonDetails(
  detailsId: string,
  fallbackErrorMessage: string,
): Promise<{ pokemon: PokemonDetails | null; errorMessage: string | null }> {
  try {
    const pokemon = await fetchPokemonDetails(detailsId)
    return { pokemon, errorMessage: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : fallbackErrorMessage
    return { pokemon: null, errorMessage: message }
  }
}

export default async function DetailsPage({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  setRequestLocale(locale)

  const detailsId = readSearchParam(resolvedSearchParams.details)
  const page = parsePageParam(readSearchParam(resolvedSearchParams.page))
  const query = parseQueryParam(readSearchParam(resolvedSearchParams.q))

  if (!detailsId) {
    redirect({ href: buildHomePath(page, null, query), locale })
  }

  const t = await getTranslations('details')
  const { pokemon, errorMessage } = await loadPokemonDetails(detailsId!, t('loadError'))

  return renderPokedexRoute({
    locale,
    searchParams: resolvedSearchParams,
    showDetailsPanel: true,
    detailsPanel: (
      <PokemonDetailsPanelView
        locale={locale}
        pokemon={pokemon}
        errorMessage={errorMessage}
        page={page}
        query={query}
      />
    ),
  })
}
