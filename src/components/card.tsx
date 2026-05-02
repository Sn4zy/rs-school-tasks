import { Component } from 'react'
import type { PokemonDetails } from '../../types/index.ts'

interface Props {
  pokemon: PokemonDetails
}

class Card extends Component<Props> {
  render() {
    const { pokemon } = this.props
    return (
      <div className="card">
        <img src={pokemon.sprite} alt={pokemon.name} />
        <h3>{pokemon.name}</h3>
        <p>{pokemon.flavorText}</p>
      </div>
    )
  }
}

export default Card