import type { PokemonDetails } from '../../types/index.ts'

import '../styles/card.css'

type Props = {
  pokemon: PokemonDetails
  selected: boolean
  onSelect: () => void
}

export default function Card({ pokemon, selected, onSelect }: Props) {
  const { name, sprite, flavorText } = pokemon
  const spriteSrc = sprite.trim() !== '' ? sprite : undefined

  return (
    <article
      className={`pokemon-card${selected ? ' pokemon-card--selected' : ''}`}
      onClick={onSelect}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          onSelect()
        }
      }}
      tabIndex={0}
      aria-pressed={selected}
    >
      <img className="pokemon-sprite" src={spriteSrc} alt="" />
      <h3 className="pokemon-name">{name}</h3>
      <p className="pokemon-description">{flavorText}</p>
    </article>
  )
}
