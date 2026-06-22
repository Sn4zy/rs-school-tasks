export function parsePageParam(value: string | null): number {
  const page = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(page) && page >= 1 ? page : 1
}

export function parseQueryParam(value: string | null): string {
  return (value ?? '').trim()
}

export function buildListSearch(page: number, detailsId?: string | null, query?: string): string {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (detailsId) {
    params.set('details', detailsId)
  }
  const normalizedQuery = (query ?? '').trim()
  if (normalizedQuery) {
    params.set('q', normalizedQuery)
  }
  const search = params.toString()
  return search ? `?${search}` : ''
}

export function buildHomePath(page: number, detailsId?: string | null, query?: string): string {
  const search = buildListSearch(page, detailsId, query)
  return search ? '/' + search : '/'
}

export function buildDetailsPath(page: number, detailsId: string, query?: string): string {
  return `/details${buildListSearch(page, detailsId, query)}`
}
