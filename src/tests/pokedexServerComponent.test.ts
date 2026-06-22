import { readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

describe('Pokedex server rendering', () => {
  it('implements search results as server components', () => {
    const shellSource = readFileSync(path.join(__dirname, '../views/PokedexShell.tsx'), 'utf8')
    const resultsSource = readFileSync(path.join(__dirname, '../components/searchResults.tsx'), 'utf8')
    const routeSource = readFileSync(
      path.join(__dirname, '../app/[locale]/page.tsx'),
      'utf8',
    )

    expect(shellSource).not.toMatch(/['"]use client['"]/)
    expect(resultsSource).not.toMatch(/['"]use client['"]/)
    expect(routeSource).toContain('renderPokedexRoute')
  })

  it('implements details panel fetching on the server', () => {
    const detailsPageSource = readFileSync(
      path.join(__dirname, '../app/[locale]/details/page.tsx'),
      'utf8',
    )
    const panelSource = readFileSync(
      path.join(__dirname, '../views/PokemonDetailsPanelView.tsx'),
      'utf8',
    )

    expect(detailsPageSource).toContain('fetchPokemonDetails')
    expect(panelSource).not.toMatch(/['"]use client['"]/)
  })

  it('wires search and detail selection through server actions', () => {
    const searchFormSource = readFileSync(path.join(__dirname, '../components/searchForm.tsx'), 'utf8')
    const cardSource = readFileSync(path.join(__dirname, '../components/card.tsx'), 'utf8')
    const actionsSource = readFileSync(path.join(__dirname, '../actions/pokedex.ts'), 'utf8')

    expect(searchFormSource).toContain('submitSearchAction')
    expect(cardSource).toContain('openDetailsAction')
    expect(actionsSource).toContain('submitSearchAction')
    expect(actionsSource).toContain('openPokemonDetailsAction')
  })
})
