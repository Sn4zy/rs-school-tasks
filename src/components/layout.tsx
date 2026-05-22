import { useCallback, useEffect, type MouseEvent } from 'react'
import { Outlet, useMatch, useNavigate, useSearchParams } from 'react-router-dom'

import { buildListSearch, parsePageParam } from '../utils/urlParams.ts'
import '../styles/layout.css'
import ErrorThrower from './errorThrower.tsx'
import Result from './result.tsx'
import Search from './search.tsx'

interface Props {
  committedQuery: string
  onCommitSearch: (trimmed: string) => void
}

export default function Layout({ committedQuery, onCommitSearch }: Props) {
  const navigate = useNavigate()
  const [searchParams, setSearchParams] = useSearchParams()
  const detailsRoute = useMatch('/details')
  const page = parsePageParam(searchParams.get('page'))
  const detailsParam = searchParams.get('details')
  const selectedId =
    detailsParam !== null && detailsParam !== ''
      ? Number.parseInt(detailsParam, 10)
      : null
  const showDetailsPanel =
    detailsRoute !== null &&
    selectedId !== null &&
    !Number.isNaN(selectedId)

  useEffect(() => {
    if (!searchParams.get('page')) {
      setSearchParams(
        (prev) => {
          const next = new URLSearchParams(prev)
          next.set('page', '1')
          return next
        },
        { replace: true },
      )
    }
  }, [searchParams, setSearchParams])

  const commitSearch = useCallback(
    (trimmed: string) => {
      onCommitSearch(trimmed)
      navigate({ pathname: '/', search: buildListSearch(1) })
    },
    [onCommitSearch, navigate],
  )

  const openDetails = useCallback(
    (id: number) => {
      navigate({
        pathname: '/details',
        search: buildListSearch(page, String(id)),
      })
    },
    [navigate, page],
  )

  const closeDetails = useCallback(() => {
    navigate({ pathname: '/', search: buildListSearch(page) })
  }, [navigate, page])

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
        <h2 className="search-area-heading">Search</h2>
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
          <section className="results-area results-area--details">
            <Outlet />
          </section>
        )}
      </div>

      <div className="debug-error-row">
        <ErrorThrower />
      </div>
    </main>
  )
}
