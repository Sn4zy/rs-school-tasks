import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import { renderApp } from './testUtils.tsx'

const { searchPokemonMock } = vi.hoisted(() => ({
  searchPokemonMock: vi.fn(),
}))

vi.mock('../../api/pokemon.ts', () => ({
  searchPokemon: (query: string, page?: number) => searchPokemonMock(query, page),
  fetchPokemonDetails: vi.fn(),
}))

function sampleItems(count: number): PokemonDetails[] {
  return Array.from({ length: count }, (_, i) => ({
    id: i + 1,
    name: `pokemon-${i + 1}`,
    sprite: `https://example.com/sprite-${i + 1}.png`,
    flavorText: `Description for pokemon ${i + 1}.`,
  }))
}

describe('CSV download from flyout', () => {
  beforeEach(() => {
    searchPokemonMock.mockReset()
    searchPokemonMock.mockResolvedValue(sampleItems(3))
  })

  it('generates a csv file with selected item details when Download is clicked', async () => {
    const user = userEvent.setup()
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
      renderApp(['/?page=1'])
      const articles = await screen.findAllByRole('article')

      await user.click(within(articles[0]).getByRole('checkbox'))
      await user.click(within(articles[2]).getByRole('checkbox'))
      await user.click(screen.getByRole('button', { name: /^download$/i }))

      expect(capture.link?.download).toBe('2_items.csv')
      expect(capture.blob).toBeInstanceOf(Blob)

      const csv = await capture.blob!.text()
      expect(csv).toContain('id,name,description,details_url,sprite_url')
      expect(csv).toContain('pokemon-1')
      expect(csv).toContain('Description for pokemon 1.')
      expect(csv).toContain('/details?page=1&details=1')
      expect(csv).toContain('pokemon-3')
      expect(csv).not.toContain('pokemon-2')
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    } finally {
      createElementSpy.mockRestore()
      createObjectURL.mockRestore()
      revokeObjectURL.mockRestore()
    }
  })
})
