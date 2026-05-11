import { fetchPokemonDetails, searchPokemon } from '../../api/pokemon.ts'

type MockResponse = { ok: boolean; statusText: string; json: () => Promise<unknown> }
type Routes = Record<string, MockResponse>

const ok = (data: unknown): MockResponse => ({ ok: true, statusText: 'OK', json: async () => data })
const fail = (statusText: string): MockResponse => ({ ok: false, statusText, json: async () => ({}) })

function mockFetch(routes: Routes) {
  ;(globalThis as unknown as { fetch: unknown }).fetch = vi.fn(async (url: string) => {
    const resp = routes[url]
    if (!resp) throw new Error(`Unexpected URL: ${url}`)
    return resp as unknown as Response
  })
}

describe('pokemon api (mocked fetch)', () => {
  it('fetchPokemonDetails returns normalized PokemonDetails (success)', async () => {
    mockFetch({
      'https://pokeapi.co/api/v2/pokemon/pikachu': ok({
        id: 25,
        name: 'pikachu',
        sprites: { front_default: 'https://img/pika.png' },
      }),
      'https://pokeapi.co/api/v2/pokemon-species/25': ok({
        flavor_text_entries: [
          { flavor_text: 'JP text', language: { name: 'ja' } },
          { flavor_text: 'EN text', language: { name: 'en' } },
        ],
      }),
    })

    await expect(fetchPokemonDetails('pikachu')).resolves.toEqual({
      id: 25,
      name: 'pikachu',
      sprite: 'https://img/pika.png',
      flavorText: 'EN text',
    })
  })

  it('fetchPokemonDetails throws when first request fails (4xx/5xx)', async () => {
    ;(globalThis as unknown as { fetch: unknown }).fetch = vi.fn(async () => fail('Not Found') as unknown as Response)

    await expect(fetchPokemonDetails('missing')).rejects.toThrow(
      'Failed to fetch Pokemon details: Not Found',
    )
  })

  it('searchPokemon (empty query) calls list endpoint with correct page params', async () => {
    mockFetch({
      // page=2 => offset=10
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=10': ok({
        count: 2,
        results: [
          { name: 'pikachu', url: 'x' },
          { name: 'eevee', url: 'y' },
        ],
      }),

      // details for pikachu
      'https://pokeapi.co/api/v2/pokemon/pikachu': ok({
        id: 25,
        name: 'pikachu',
        sprites: { front_default: 'p1' },
      }),
      'https://pokeapi.co/api/v2/pokemon-species/25': ok({
        flavor_text_entries: [{ flavor_text: 't1', language: { name: 'en' } }],
      }),

      // details for eevee
      'https://pokeapi.co/api/v2/pokemon/eevee': ok({
        id: 133,
        name: 'eevee',
        sprites: { front_default: 'p2' },
      }),
      'https://pokeapi.co/api/v2/pokemon-species/133': ok({
        flavor_text_entries: [{ flavor_text: 't2', language: { name: 'en' } }],
      }),
    })

    const items = await searchPokemon('', 2)

    expect(globalThis.fetch).toHaveBeenNthCalledWith(
      1,
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=10',
    )
    expect(items).toHaveLength(2)
    expect(items[0]?.name).toBe('pikachu')
    expect(items[1]?.name).toBe('eevee')
  })

  it('searchPokemon (non-empty query) trims and lowercases before fetching details', async () => {
    mockFetch({
      'https://pokeapi.co/api/v2/pokemon/bulbasaur': ok({
        id: 1,
        name: 'bulbasaur',
        sprites: { front_default: 'p' },
      }),
      'https://pokeapi.co/api/v2/pokemon-species/1': ok({
        flavor_text_entries: [{ flavor_text: 'desc', language: { name: 'en' } }],
      }),
    })

    const items = await searchPokemon('  BULBASAUR  ')

    expect(globalThis.fetch).toHaveBeenNthCalledWith(1, 'https://pokeapi.co/api/v2/pokemon/bulbasaur')
    expect(items).toHaveLength(1)
    expect(items[0]?.name).toBe('bulbasaur')
  })

  it('searchPokemon throws appropriate error when list endpoint fails', async () => {
    mockFetch({
      'https://pokeapi.co/api/v2/pokemon?limit=10&offset=0': fail('Internal Server Error'),
    })

    await expect(searchPokemon('', 1)).rejects.toThrow(
      'Failed to fetch Pokemon list: Internal Server Error',
    )
  })
})

