export function parsePageParam(value: string | null): number {
  const page = Number.parseInt(value ?? '1', 10)
  return Number.isFinite(page) && page >= 1 ? page : 1
}

export function buildPageSearch(page: number): string {
  return `?page=${page}`
}
