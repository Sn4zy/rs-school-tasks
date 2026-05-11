export interface PokemonListItem {
  name: string
  url: string
}

export interface PokemonListResponse {
  count: number
  results: PokemonListItem[]
}

export interface PokemonApiDetails {
  name: string
  id: number
  sprites: {
    front_default: string
  }
}

export interface PokemonSpecies {
  flavor_text_entries: Array<{
    flavor_text: string
    language: {
      name: string
    }
  }>
}

export interface PokemonDetails {
  name: string
  id: number
  sprite: string
  flavorText: string
}
