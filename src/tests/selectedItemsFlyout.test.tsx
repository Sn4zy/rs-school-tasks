import { readFileSync } from 'node:fs'
import path from 'node:path'
import { fileURLToPath } from 'node:url'

import { screen, within } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import type { PokemonDetails } from '../../types/index.ts'
import { selectSelectedCount } from '../store/selectedItemsSlice.ts'
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

describe('Selected items flyout', () => {
  beforeEach(() => {
    searchPokemonMock.mockReset()
    searchPokemonMock.mockResolvedValue(sampleItems(2))
  })

  it('is hidden when no items are selected', async () => {
    renderApp(['/?page=1'])
    await screen.findAllByRole('article')

    expect(screen.queryByRole('complementary', { name: /selected items/i })).not.toBeInTheDocument()
  })

  it('appears with sticky positioning when at least one item is selected', async () => {
    const user = userEvent.setup()
    renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))

    const flyout = screen.getByRole('complementary', { name: /selected items/i })
    expect(flyout).toHaveClass('selected-items-flyout')

    const cssPath = path.join(
      path.dirname(fileURLToPath(import.meta.url)),
      '../styles/selectedItemsFlyout.css',
    )
    const css = readFileSync(cssPath, 'utf8')
    expect(css).toMatch(/position:\s*sticky/)
    expect(css).toMatch(/bottom:\s*0/)
  })

  it('displays the number of selected items', async () => {
    const user = userEvent.setup()
    renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))
    expect(screen.getByText('1 item selected')).toBeInTheDocument()

    await user.click(within(articles[1]).getByRole('checkbox'))
    expect(screen.getByText('2 items selected')).toBeInTheDocument()
  })

  it('clears all selections when Unselect all is clicked', async () => {
    const user = userEvent.setup()
    const { store } = renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))
    await user.click(within(articles[1]).getByRole('checkbox'))
    await user.click(screen.getByRole('button', { name: /unselect all/i }))

    expect(selectSelectedCount(store.getState())).toBe(0)
    expect(screen.queryByRole('complementary', { name: /selected items/i })).not.toBeInTheDocument()
    expect(within(articles[0]).getByRole('checkbox')).not.toBeChecked()
  })

  it('downloads selected items when Download is clicked', async () => {
    const user = userEvent.setup()
    const createObjectURL = vi.spyOn(URL, 'createObjectURL').mockReturnValue('blob:mock-url')
    const revokeObjectURL = vi.spyOn(URL, 'revokeObjectURL').mockImplementation(() => {})
    const click = vi.fn()
    const originalCreateElement = document.createElement.bind(document)
    const createElementSpy = vi.spyOn(document, 'createElement').mockImplementation((tagName, options) => {
      const element = originalCreateElement(tagName, options)
      if (tagName === 'a') {
        vi.spyOn(element, 'click').mockImplementation(click)
      }
      return element
    })

    try {
      renderApp(['/?page=1'])
      const articles = await screen.findAllByRole('article')
      await user.click(within(articles[0]).getByRole('checkbox'))
      await user.click(screen.getByRole('button', { name: /^download$/i }))

      expect(createObjectURL).toHaveBeenCalled()
      expect(click).toHaveBeenCalled()
      expect(revokeObjectURL).toHaveBeenCalledWith('blob:mock-url')
    } finally {
      createElementSpy.mockRestore()
      createObjectURL.mockRestore()
      revokeObjectURL.mockRestore()
    }
  })

  it('remains visible on the About page while items stay selected', async () => {
    const user = userEvent.setup()
    renderApp(['/?page=1'])
    const articles = await screen.findAllByRole('article')

    await user.click(within(articles[0]).getByRole('checkbox'))
    await user.click(screen.getByRole('link', { name: /^about$/i }))

    expect(screen.getByRole('complementary', { name: /selected items/i })).toBeInTheDocument()
    expect(screen.getByText('1 item selected')).toBeInTheDocument()
  })
})
