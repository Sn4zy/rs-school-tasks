import { vi } from 'vitest'

export type FetchCall = {
  url: string
}

export type RtkFetchMockOptions = {
  /** When true, fetch awaits until release() is called (for loading tests). */
  hold?: boolean
  /** Fail list pagination requests with HTTP 500. */
  failList?: boolean
  /** Fail pokemon detail requests (all or one name/id). */
  failPokemonMatching?: string | RegExp
  /** Fail species requests. */
  failSpecies?: boolean
}

export function getFetchUrl(input: RequestInfo | URL): string {
  if (typeof input === 'string') return input
  if (input instanceof URL) return input.toString()
  if (input instanceof Request) return input.url
  return String(input)
}

export function jsonResponse(
  data: unknown,
  init?: { status?: number; statusText?: string; headers?: Record<string, string> },
) {
  const status = init?.status ?? 200
  const statusText = init?.statusText ?? 'OK'
  return new Response(JSON.stringify(data), {
    status,
    statusText,
    headers: { 'content-type': 'application/json', ...(init?.headers ?? {}) },
  })
}

export function createRtkFetchMock(options: RtkFetchMockOptions = {}) {
  const calls: FetchCall[] = []
  let hold = options.hold ?? false

  const release = () => {
    hold = false
  }

  const matchesPokemonFailure = (name: string) => {
    if (!options.failPokemonMatching) return false
    if (typeof options.failPokemonMatching === 'string') {
      return name === options.failPokemonMatching
    }
    return options.failPokemonMatching.test(name)
  }

  const fetchMock = vi.fn(async (input: RequestInfo | URL) => {
    const url = getFetchUrl(input)
    calls.push({ url })

    while (hold) {
      await new Promise((r) => setTimeout(r, 0))
    }

    if (url.includes('/pokemon?limit=10&offset=')) {
      if (options.failList) {
        return jsonResponse(
          { message: 'Internal Server Error' },
          { status: 500, statusText: 'Internal Server Error' },
        )
      }

      const offsetMatch = /offset=(\d+)/.exec(url)
      const offset = offsetMatch ? Number(offsetMatch[1]) : 0
      const startId = offset + 1
      return jsonResponse({
        count: 1000,
        results: [
          { name: `pokemon-${startId}`, url: `https://pokeapi.co/api/v2/pokemon/${startId}` },
          { name: `pokemon-${startId + 1}`, url: `https://pokeapi.co/api/v2/pokemon/${startId + 1}` },
        ],
      })
    }

    const pokemonMatch = /\/pokemon\/([^/?#]+)/.exec(url)
    if (pokemonMatch) {
      const name = pokemonMatch[1]
      if (matchesPokemonFailure(name)) {
        return jsonResponse({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' })
      }

      const idMatch = /pokemon-(\d+)/.exec(name)
      const id = idMatch ? Number(idMatch[1]) : 25
      return jsonResponse({
        id,
        name,
        sprites: { front_default: `https://example.com/${id}.png` },
      })
    }

    const speciesMatch = /\/pokemon-species\/(\d+)/.exec(url)
    if (speciesMatch) {
      if (options.failSpecies) {
        return jsonResponse({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' })
      }

      const id = Number(speciesMatch[1])
      return jsonResponse({
        flavor_text_entries: [
          { flavor_text: `Description for pokemon ${id}.`, language: { name: 'en' } },
        ],
      })
    }

    return jsonResponse({ message: 'Not Found' }, { status: 404, statusText: 'Not Found' })
  })

  return { calls, fetchMock, release }
}
