import type { PokemonDetails } from '../../types/index.ts'
import Card from './card.tsx'

type Props = {
  items: PokemonDetails[]
  selectedId: number | null
  onSelectPokemon: (id: number) => void
}

export default function CardList({ items, selectedId, onSelectPokemon }: Props) {
  return (
    <div className="pokemon-cards">
      {items.map((pokemon) => (
        <Card
          key={pokemon.id}
          pokemon={pokemon}
          selected={selectedId === pokemon.id}
          onSelect={() => onSelectPokemon(pokemon.id)}
        />
      ))}
    </div>
  )
}
