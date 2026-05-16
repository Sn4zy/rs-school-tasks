import type { PokemonDetails } from '../../types/index.ts'
import Card from './card.tsx'

type Props = { items: PokemonDetails[] }

export default function CardList({ items }: Props) {
  return (
    <div className="pokemon-cards">
      {items.map((pokemon) => (
        <Card key={pokemon.id} pokemon={pokemon} />
      ))}
    </div>
  )
}
