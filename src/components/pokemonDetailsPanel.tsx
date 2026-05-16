import { useEffect, useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'

import { fetchPokemonDetails } from '../../api/pokemon.ts'
import type { PokemonDetails } from '../../types/index.ts'
import { buildListSearch, parsePageParam } from '../utils/urlParams.ts'
import Loading from './Loading.tsx'

interface ContentProps {
  detailsId: string
  page: number
}

function PokemonDetailsContent({ detailsId, page }: ContentProps) {
  const navigate = useNavigate()
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let cancelled = false

    fetchPokemonDetails(detailsId)
      .then((data) => {
        if (!cancelled) {
          setPokemon(data)
          setLoading(false)
        }
      })
      .catch((err: unknown) => {
        if (!cancelled) {
          setLoading(false)
          setError(err instanceof Error ? err.message : 'Could not load details.')
        }
      })

    return () => {
      cancelled = true
    }
  }, [detailsId])

  const closeDetails = () => {
    navigate({ pathname: '/', search: buildListSearch(page) })
  }

  return (
    <aside className="details-panel" aria-label="Pokémon details">
      <div className="details-panel-header">
        <h2 className="details-panel-heading">Details</h2>
        <button type="button" className="details-close-button" onClick={closeDetails}>
          Close
        </button>
      </div>

      {loading ? (
        <Loading label="Loading details…" />
      ) : error ? (
        <div className="error-panel">{error}</div>
      ) : pokemon ? (
        <article className="pokemon-card pokemon-card--detail">
          <img
            className="pokemon-sprite"
            src={pokemon.sprite.trim() !== '' ? pokemon.sprite : undefined}
            alt=""
          />
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <p className="pokemon-description">{pokemon.flavorText}</p>
          <p className="pokemon-id">ID: {pokemon.id}</p>
        </article>
      ) : null}
    </aside>
  )
}

export default function PokemonDetailsPanel() {
  const [searchParams] = useSearchParams()
  const detailsId = searchParams.get('details')
  const page = parsePageParam(searchParams.get('page'))

  if (!detailsId) {
    return null
  }

  return <PokemonDetailsContent key={detailsId} detailsId={detailsId} page={page} />
}
