import { Component } from 'react'
import type { PokemonDetails } from '../../types/index.ts'

type Props = { pokemon: PokemonDetails }

class Card extends Component<Props> {
  render() {
    const { name, sprite, flavorText } = this.props.pokemon
    const spriteSrc = sprite.trim() !== '' ? sprite : undefined

    return (
      <article className="pokemon-card">
        <img className="pokemon-sprite" src={spriteSrc} alt="" />
        <h3 className="pokemon-name">{name}</h3>
        <p className="pokemon-description">{flavorText}</p>
      </article>
    )
  }
}

export default Card
