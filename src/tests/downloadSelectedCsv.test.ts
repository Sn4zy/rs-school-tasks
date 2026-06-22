import { describe, expect, it } from 'vitest'

import type { PokemonDetails } from '../../types/index.ts'
import {
  buildDetailsUrl,
  buildSelectedItemsCsv,
  escapeCsvField,
  getSelectedItemsCsvFilename,
} from '../utils/downloadSelectedCsv.ts'

function samplePokemon(id: number): PokemonDetails {
  return {
    id,
    name: `pokemon-${id}`,
    sprite: `https://example.com/sprite-${id}.png`,
    flavorText: `Description for pokemon ${id}.`,
  }
}

describe('downloadSelectedCsv', () => {
  it('escapes csv fields with commas and quotes', () => {
    expect(escapeCsvField('plain')).toBe('plain')
    expect(escapeCsvField('has, comma')).toBe('"has, comma"')
    expect(escapeCsvField('say "hi"')).toBe('"say ""hi"""')
  })

  it('builds csv with name, description, details url, and other useful info', () => {
    const csv = buildSelectedItemsCsv([samplePokemon(1)], 'https://pokedex.test')

    expect(csv).toBe(
      [
        'id,name,description,details_url,sprite_url',
        '1,pokemon-1,Description for pokemon 1.,https://pokedex.test/details?page=1&details=1,https://example.com/sprite-1.png',
      ].join('\n'),
    )
  })

  it('buildDetailsUrl creates a details route url', () => {
    expect(buildDetailsUrl(25, 'https://pokedex.test')).toBe(
      'https://pokedex.test/details?page=1&details=25',
    )
  })

  it('names the file using the number of selected items', () => {
    expect(getSelectedItemsCsvFilename(15)).toBe('15_items.csv')
    expect(getSelectedItemsCsvFilename(1)).toBe('1_items.csv')
  })
})
