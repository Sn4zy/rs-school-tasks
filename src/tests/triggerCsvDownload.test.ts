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
      const csv = `id,name\n1,${samplePokemon(1).name}\n2,${samplePokemon(2).name}`
      triggerCsvDownload(csv, '2_items.csv')

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
})
