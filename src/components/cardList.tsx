import type { PokemonDetails } from '../../types/index.ts'
import Card from './card.tsx'

type Props = {
  items: PokemonDetails[]
  detailsOpenId: number | null
  onOpenDetails: (id: number) => void
}

export default function CardList({ items, detailsOpenId, onOpenDetails }: Props) {
  return (
    <div className="pokemon-cards">
      {items.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          detailsOpenId={detailsOpenId}
          onOpenDetails={onOpenDetails}
        />
      ))}
    </div>
  )
}
