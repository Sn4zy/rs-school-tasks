export const SEARCH_STORAGE_KEY = 'rs-school-pokedex-search'

export function readStoredSearch(): string {
  try {
    const value = localStorage.getItem(SEARCH_STORAGE_KEY)
    return value ?? ''
  } catch {
    return ''
  }
}

