import type { PokemonDetails } from '../../types/index.ts'

export function escapeCsvField(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`
  }
  return value
}

export function buildDetailsUrl(id: number, origin: string): string {
  return `${origin}/details?page=1&details=${id}`
}

export function buildSelectedItemsCsv(items: PokemonDetails[], origin: string): string {
  const header = ['id', 'name', 'description', 'details_url', 'sprite_url']
  const rows = items.map((item) => [
    String(item.id),
    escapeCsvField(item.name),
    escapeCsvField(item.flavorText),
    escapeCsvField(buildDetailsUrl(item.id, origin)),
    escapeCsvField(item.sprite),
  ])

  return [header.join(','), ...rows.map((row) => row.join(','))].join('\n')
}

export function getSelectedItemsCsvFilename(count: number): string {
  return `${count}_items.csv`
}
