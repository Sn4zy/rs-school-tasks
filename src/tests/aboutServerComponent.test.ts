import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import type { PokemonDetails } from '../../types/index.ts'
import { generateSelectedItemsCsvAction } from '../actions/downloadSelectedCsv.ts'

function samplePokemon(id: number): PokemonDetails {
  return {
    id,
    name: `pokemon-${id}`,
    sprite: `https://example.com/sprite-${id}.png`,
    flavorText: `Description for pokemon ${id}.`,
  }
}

describe('generateSelectedItemsCsvAction', () => {
  it('returns null when there are no selected items', async () => {
    await expect(generateSelectedItemsCsvAction([])).resolves.toBeNull()
  })

  it('generates csv content on the server using the request origin', async () => {
    const result = await generateSelectedItemsCsvAction([samplePokemon(7)])

    expect(result).not.toBeNull()
    expect(result?.filename).toBe('1_items.csv')
    expect(result?.csv).toContain('pokemon-7')
    expect(result?.csv).toContain('http://localhost:3000/details?page=1&details=7')
  })
})

describe('About page server component', () => {
  it('implements core content without a client component boundary', () => {
    const source = readFileSync(path.join(__dirname, '../views/AboutPage.tsx'), 'utf8')

    expect(source).not.toMatch(/['"]use client['"]/)
    expect(source).toContain("from '@/i18n/navigation'")
    expect(source).toContain('getTranslations')
  })

  it('is configured for static generation', () => {
    const source = readFileSync(
      path.join(__dirname, '../app/[locale]/(shell)/about/page.tsx'),
      'utf8',
    )

    expect(source).toContain("export const dynamic = 'force-static'")
  })
})
