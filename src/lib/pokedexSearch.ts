import { searchPokemon } from '../../api/pokemon.ts'
import type { PokemonDetails } from '../../types/index.ts'

export type PokedexSearchState = {
  items: PokemonDetails[]
  errorMessage: string | null
}

export async function loadPokedexSearchResults(
  query: string,
  page: number,
  fallbackErrorMessage: string,
): Promise<PokedexSearchState> {
  try {
    const items = await searchPokemon(query, page)
    return { items, errorMessage: null }
  } catch (error) {
    const message = error instanceof Error ? error.message : fallbackErrorMessage
    return { items: [], errorMessage: message }
  }
}
