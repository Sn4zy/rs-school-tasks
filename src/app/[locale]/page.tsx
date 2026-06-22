import { setRequestLocale } from 'next-intl/server'

import { renderPokedexRoute } from '@/lib/renderPokedexRoute'

export const dynamic = 'force-dynamic'

type Props = {
  params: Promise<{ locale: string }>
  searchParams: Promise<Record<string, string | string[] | undefined>>
}

export default async function HomePage({ params, searchParams }: Props) {
  const { locale } = await params
  const resolvedSearchParams = await searchParams
  setRequestLocale(locale)

  return renderPokedexRoute({
    locale,
    searchParams: resolvedSearchParams,
    detailsPanel: null,
    showDetailsPanel: false,
  })
}
