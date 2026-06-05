import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import type { SearchPokemonArg } from '../api/pokemonApi.ts'
import { renderApp } from './testUtils.tsx'

const { useSearchPokemonQueryMock } = vi.hoisted(() => ({
  useSearchPokemonQueryMock: vi.fn(),
}))

vi.mock('../api/pokemonApi.ts', async () => {
  const actual = await vi.importActual<typeof import('../api/pokemonApi.ts')>('../api/pokemonApi.ts')
  return {
    ...actual,
    useSearchPokemonQuery: (arg: SearchPokemonArg) => useSearchPokemonQueryMock(arg),
    usePokemonDetailsQuery: () => ({
      data: undefined,
      isLoading: true,
      isFetching: true,
      error: undefined,
    }),
  }
})

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
    useSearchPokemonQueryMock.mockReset()
    useSearchPokemonQueryMock.mockReturnValue({
      data: sampleItems(3),
      isLoading: false,
      isFetching: false,
      error: undefined,
    })
  })

  it('generates a csv file with selected item details when Download is clicked', async () => {
    const user = userEvent.setup()
    let capturedBlob: Blob | null = null
    let downloadLink: HTMLAnchorElement | null = null
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockImplementation((blob) => {
      capturedBlob = blob as Blob
      return 'blob:mock-url'
    })
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const click = vi.fn()
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
      renderApp(['/?page=1'])
      const articles = await screen.findAllByRole('article')

      await user.click(within(articles[0]).getByRole('checkbox'))
      await user.click(within(articles[2]).getByRole('checkbox'))
      await user.click(screen.getByRole('button', { name: /^download$/i }))

      expect(downloadLink?.download).toBe('2_items.csv')
      expect(capturedBlob).toBeInstanceOf(Blob)

      const csv = await capturedBlob!.text()
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
