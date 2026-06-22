export function parsePageParam(value: string | null): number {
  const page = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(page) && page >= 1 ? page : 1
}

export function buildListSearch(page: number, detailsId?: string | null): string {
  const params = new URLSearchParams()
  params.set('page', String(page))
  if (detailsId) {
    params.set('details', detailsId)
  }
  const query = params.toString()
  return query ? `?${query}` : ''
}

export function buildHomePath(page: number, detailsId?: string | null): string {
  const search = buildListSearch(page, detailsId)
  return search ? '/' + search : '/'
}

export function buildDetailsPath(page: number, detailsId: string): string {
  return `/details${buildListSearch(page, detailsId)}`
}
