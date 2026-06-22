'use client'

import { useCallback, useEffect, type MouseEvent, type ReactNode } from 'react'
import { useTranslations } from 'next-intl'

import { usePathname, useRouter } from '@/i18n/navigation.ts'
import { buildDetailsPath, buildHomePath, parsePageParam } from '../utils/urlParams.ts'
import '../styles/layout.css'
import ErrorThrower from './errorThrower.tsx'
import Result from './result.tsx'
import Search from './search.tsx'
import { useSearchParams } from 'next/navigation'

interface Props {
  committedQuery: string
  onCommitSearch: (trimmed: string) => void
  children: ReactNode
}

export default function Layout({ committedQuery, onCommitSearch, children }: Props) {
  const t = useTranslations('search')
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()
  const page = parsePageParam(searchParams?.get('page') ?? null)
  const detailsParam = searchParams?.get('details') ?? null
  const selectedId =
    detailsParam !== null && detailsParam !== ''
      ? Number.parseInt(detailsParam, 10)
      : null
  const showDetailsPanel =
    pathname === '/details' &&
    selectedId !== null &&
    !Number.isNaN(selectedId)

  useEffect(() => {
    if (!searchParams?.get('page')) {
      const params = new URLSearchParams(searchParams?.toString() ?? '')
      params.set('page', '1')
      router.replace(`${pathname}?${params.toString()}`)
    }
  }, [searchParams, router, pathname])

  const commitSearch = useCallback(
    (trimmed: string) => {
      onCommitSearch(trimmed)
      router.push(buildHomePath(1))
    },
    [onCommitSearch, router],
  )

  const openDetails = useCallback(
    (id: number) => {
      router.push(buildDetailsPath(page, String(id)))
    },
    [router, page],
  )

  const closeDetails = useCallback(() => {
    router.push(buildHomePath(page))
  }, [router, page])

  const handleMainPanelClick = (event: MouseEvent<HTMLElement>) => {
    if (!showDetailsPanel) {
      return
    }
    const target = event.target
    if (!(target instanceof HTMLElement)) {
      return
    }
    if (target.closest('.pokemon-card, .pagination, .search-controls, .details-panel')) {
      return
    }
    closeDetails()
  }

  return (
    <main className="main-page" onClick={handleMainPanelClick}>
      <section className="search-area">
        <h2 className="search-area-heading">{t('heading')}</h2>
        <Search committedQuery={committedQuery} onCommittedSearch={commitSearch} />
      </section>

      <div className={`master-detail${showDetailsPanel ? ' master-detail--split' : ''}`}>
        <section className="results-area results-area--list">
          <Result
            key={`${committedQuery}-${page}`}
            query={committedQuery}
            selectedId={showDetailsPanel ? selectedId : null}
            onSelectPokemon={openDetails}
          />
        </section>

        {showDetailsPanel && (
          <section className="results-area results-area--details">{children}</section>
        )}
      </div>

      <div className="debug-error-row">
        <ErrorThrower />
      </div>
    </main>
  )
}
