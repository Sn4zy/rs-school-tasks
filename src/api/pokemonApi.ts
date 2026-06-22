import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import type { FetchBaseQueryError } from '@reduxjs/toolkit/query'

import type {
  PokemonApiDetails,
  PokemonDetails,
  PokemonListResponse,
  PokemonSpecies,
} from '../../types/index.ts'

const DEFAULT_TTL_MS = 60_000

function ttlSecondsFromEnv(): number {
  const raw = process.env.NEXT_PUBLIC_API_CACHE_TTL_MS
  const parsed = typeof raw === 'string' ? Number(raw) : Number.NaN
  const ttlMs = Number.isFinite(parsed) && parsed > 0 ? parsed : DEFAULT_TTL_MS
  return Math.max(0, Math.floor(ttlMs / 1000))
}

const baseQuery = fetchBaseQuery({
  baseUrl: 'https://pokeapi.co/api/v2/',
})

type QueryFnHelpers = {
  signal: AbortSignal
}

async function fetchPokemonDetailsByName(
  nameOrId: string,
  _api: QueryFnHelpers,
  base: (arg: string) => Promise<{ data?: unknown; error?: FetchBaseQueryError }>,
): Promise<{ data: PokemonDetails } | { error: FetchBaseQueryError }> {
  const pokemonResult = await base(`pokemon/${nameOrId}`)
  if (pokemonResult.error) {
    return { error: pokemonResult.error }
  }

  const pokemonData = pokemonResult.data as PokemonApiDetails
  const speciesResult = await base(`pokemon-species/${pokemonData.id}`)
  if (speciesResult.error) {
    return { error: speciesResult.error }
  }

  const speciesData = speciesResult.data as PokemonSpecies
  const englishEntry = speciesData.flavor_text_entries.find(
    (entry) => entry.language.name === 'en',
  )

  return {
    data: {
      id: pokemonData.id,
      name: pokemonData.name,
      sprite: pokemonData.sprites.front_default,
      flavorText: englishEntry ? englishEntry.flavor_text : 'The Description is not available',
    },
  }
}

export type SearchPokemonArg = {
  query: string
  page: number
}

export function normalizeSearchQuery(query: string): string {
  return query.trim().toLowerCase()
}

export function pokemonListCacheTag(arg: SearchPokemonArg) {
  const normalizedQuery = normalizeSearchQuery(arg.query)
  return {
    type: 'PokemonList' as const,
    id: `page-${arg.page}-${normalizedQuery}`,
  }
}

export function pokemonDetailsCacheTag(detailsId: string) {
  return { type: 'PokemonDetails' as const, id: detailsId }
}

export const pokemonApi = createApi({
  reducerPath: 'pokemonApi',
  baseQuery,
  tagTypes: ['PokemonList', 'PokemonDetails'],
  keepUnusedDataFor: ttlSecondsFromEnv(),
  endpoints: (builder) => ({
    searchPokemon: builder.query<PokemonDetails[], SearchPokemonArg>({
      async queryFn(arg, api, _extraOptions, baseQueryFn) {
        const base = async (url: string) => {
          const result = await baseQueryFn({ url, method: 'GET', signal: api.signal })
          return result as { data?: unknown; error?: FetchBaseQueryError }
        }

        const normalizedQuery = arg.query.trim().toLowerCase()
        const page = arg.page
        const limit = 10
        const offset = (page - 1) * limit

        if (normalizedQuery === '') {
          const listResult = await base(`pokemon?limit=${limit}&offset=${offset}`)
          if (listResult.error) {
            return { error: listResult.error }
          }

          const listData = listResult.data as PokemonListResponse
          const detailsResults = await Promise.all(
            listData.results.map((pokemon) => fetchPokemonDetailsByName(pokemon.name, api, base)),
          )

          const firstError = detailsResults.find(
            (result): result is { error: FetchBaseQueryError } => 'error' in result,
          )
          if (firstError) {
            return { error: firstError.error }
          }

          return {
            data: detailsResults.map((result) => (result as { data: PokemonDetails }).data),
          }
        }

        const detailResult = await fetchPokemonDetailsByName(normalizedQuery, api, base)
        if ('error' in detailResult) {
          return { error: detailResult.error }
        }
        return { data: [detailResult.data] }
      },
      providesTags: (result, _error, arg) => {
        const listTag = pokemonListCacheTag(arg)
        if (!result) {
          return [listTag]
        }

        const itemTags = result.map((item) => pokemonDetailsCacheTag(String(item.id)))
        return [listTag, ...itemTags]
      },
    }),
    pokemonDetails: builder.query<PokemonDetails, string>({
      async queryFn(detailsId, api, _extraOptions, baseQueryFn) {
        const base = async (url: string) => {
          const result = await baseQueryFn({ url, method: 'GET', signal: api.signal })
          return result as { data?: unknown; error?: FetchBaseQueryError }
        }

        const detailsResult = await fetchPokemonDetailsByName(detailsId, api, base)
        if ('error' in detailsResult) {
          return { error: detailsResult.error }
        }
        return { data: detailsResult.data }
      },
      providesTags: (_result, _error, detailsId) => [pokemonDetailsCacheTag(detailsId)],
    }),
  }),
})

export const { useSearchPokemonQuery, usePokemonDetailsQuery } = pokemonApi
