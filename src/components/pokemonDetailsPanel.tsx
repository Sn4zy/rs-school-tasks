import { useNavigate, useSearchParams } from 'react-router-dom'

import { usePokemonDetailsQuery } from '../api/pokemonApi.ts'
import { getReadableQueryError } from '../utils/rtkQueryError.ts'
import { buildListSearch, parsePageParam } from '../utils/urlParams.ts'
import '../styles/card.css'
import '../styles/error-shared.css'
import '../styles/pokemonDetailsPanel.css'
import Loading from './Loading.tsx'

interface ContentProps {
  detailsId: string
  page: number
}

function PokemonDetailsContent({ detailsId, page }: ContentProps) {
  const navigate = useNavigate()
  const { data: pokemon, isLoading, isFetching, error } = usePokemonDetailsQuery(detailsId)
  const isBusy = isLoading || isFetching
  const errorMessage = getReadableQueryError(error, 'Could not load details.')

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

      {isBusy ? (
        <Loading label="Loading details…" />
      ) : errorMessage ? (
        <div className="error-panel">{errorMessage}</div>
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
