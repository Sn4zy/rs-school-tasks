import { describe, expect, it } from 'vitest'

import type { PokemonDetails } from '../../types/index.ts'
import {
  buildDetailsUrl,
  buildSelectedItemsCsv,
  downloadSelectedItemsCsv,
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

function mockDownloadLink() {
  const click = vi.fn()
  const originalCreateElement = document.createElement.bind(document)
  const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
    const element = originalCreateElement(tagName, options)
    if (tagName === 'a') {
      vi.spyOn(element, 'click').mockImplementation(click)
    }
    return element
  })

  return { click, createElementSpy }
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

  it('uses Blob, URL.createObjectURL, and anchor download attribute', async () => {
    let capturedBlob: Blob | null = null
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      capturedBlob = blob as Blob
      return 'blob:mock-url'
    })
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const click = vi.fn()
    let downloadLink: HTMLAnchorElement | null = null
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const element = originalCreateElement(tagName, options)
      if (tagName === 'a') {
        downloadLink = element as HTMLAnchorElement
        vi.spyOn(element, 'click').mockImplementation(click)
      }
      return element
    })

    try {
      downloadSelectedItemsCsv([samplePokemon(1), samplePokemon(2)])

      expect(capturedBlob).toBeInstanceOf(Blob)
      expect(capturedBlob?.type).toBe('text/csv;charset=utf-8')
      expect(await capturedBlob!.text()).toContain('pokemon-1')
      expect(await capturedBlob!.text()).toContain('pokemon-2')
      expect(createObjectURL).toHaveBeenCalledWith(capturedBlob)
      expect(downloadLink?.download).toBe('2_items.csv')
      expect(downloadLink?.href).toBe('blob:mock-url')
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    } finally {
      createElementSpy.mockRestore()
      createObjectURL.mockRestore()
      revokeObjectURL.mockRestore()
    }
  })

  it('does not download when there are no selected items', () => {
    const createObjectURL = vi.spyOn(URL, 'createObjectURL')
    const { createElementSpy } = mockDownloadLink()

    try {
      downloadSelectedItemsCsv([])
      expect(createObjectURL).not.toHaveBeenCalled()
    } finally {
      createElementSpy.mockRestore()
      createObjectURL.mockRestore()
    }
  })
})
