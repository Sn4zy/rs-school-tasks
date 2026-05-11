import type { PokemonApiDetails, PokemonSpecies, PokemonDetails, PokemonListResponse } from "../types";

export async function fetchPokemonDetails (name: string): Promise<PokemonDetails> {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
    if (!response.ok) {
        throw new Error(`Failed to fetch Pokemon details: ${response.statusText}`);
    }

    const pokemon_data: PokemonApiDetails = await response.json();



    const response2 = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${pokemon_data.id}`)
    if (!response2.ok) {
        throw new Error(`Failed to fetch pokemon species ${response2.statusText}`);
    }

    const species_data: PokemonSpecies = await response2.json()

    const english_text = species_data.flavor_text_entries.find(entry => entry.language.name === "en")



    return{
        id: pokemon_data.id,
        name: pokemon_data.name,
        sprite: pokemon_data.sprites.front_default,
        flavorText: english_text ? english_text.flavor_text : 'The Description is not available'

    }
    }
    
    
   export async function searchPokemon(query: string, page: number = 1): Promise<PokemonDetails[]> {
        const limit = 10;
        const offset = (page - 1) * limit;
        if (query.trim() === '') {
            const response = await fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`);
            if (!response.ok) {
                throw new Error(`Failed to fetch Pokemon list: ${response.statusText}`);
            }
            const apiData: PokemonListResponse = await response.json();
            return Promise.all(apiData.results.map(async (pokemon) => {
                return fetchPokemonDetails(pokemon.name);
            }));
        } else {
            const detail = await fetchPokemonDetails(query.trim().toLowerCase());
            return [detail];
        }
    }
