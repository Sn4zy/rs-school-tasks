import type { PokemonDetails } from '../../types/index.ts'
import Card from './card.tsx'

type Props = {
  items: PokemonDetails[]
  detailsOpenId: number | null
  page: number
  query: string
  openDetailsAction: (formData: FormData) => void | Promise<void>
}

export default function CardList({
  items,
  detailsOpenId,
  page,
  query,
  openDetailsAction,
}: Props) {
  return (
    <div className="pokemon-cards">
      {items.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          detailsOpenId={detailsOpenId}
          page={page}
          query={query}
          openDetailsAction={openDetailsAction}
        />
      ))}
    </div>
  )
}
