import { describe, expect, it } from 'vitest'

import type { PokemonDetails } from '../../types/index.ts'
import { triggerCsvDownload } from '../utils/triggerCsvDownload.ts'

function samplePokemon(id: number): PokemonDetails {
  return {
    id,
    name: `pokemon-${id}`,
    sprite: `https://example.com/sprite-${id}.png`,
    flavorText: `Description for pokemon ${id}.`,
  }
}

describe('triggerCsvDownload', () => {
  it('uses Blob, URL.createObjectURL, and anchor download attribute', async () => {
    const capture = {
      blob: null as Blob | null,
      link: null as HTMLAnchorElement | null,
    }
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      capture.blob = blob as Blob
      return 'blob:mock-url'
    })
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const click = vi.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const element = originalCreateElement(tagName, options)
      if (tagName === 'a') {
        capture.link = element as HTMLAnchorElement
        vi.spyOn(element, 'click').mockImplementation(click)
      }
      return element
    })

    try {
      const csv = `id,name\n1,${samplePokemon(1).name}\n2,${samplePokemon(2).name}`
      triggerCsvDownload(csv, '2_items.csv')

      expect(capture.blob).toBeInstanceOf(Blob)
      expect(capture.blob?.type).toBe('text/csv;charset=utf-8')
      expect(await capture.blob!.text()).toContain('pokemon-1')
      expect(await capture.blob!.text()).toContain('pokemon-2')
      expect(createObjectURL).toHaveBeenCalledWith(capture.blob)
      expect(capture.link?.download).toBe('2_items.csv')
      expect(capture.link?.href).toBe('blob:mock-url')
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    } finally {
      createElementSpy.mockRestore()
      createObjectURL.mockRestore()
      revokeObjectURL.mockRestore()
    }
  })
})
