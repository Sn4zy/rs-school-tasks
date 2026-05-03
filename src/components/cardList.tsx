import { Component } from 'react'
import type { PokemonDetails } from '../../types/index.ts'
import Card from './card.tsx'

type Props = { items: PokemonDetails[] }

class CardList extends Component<Props> {
  render() {
    return (
      <div className="pokemon-cards">
        {this.props.items.map((p) => (
          <Card key={p.id} pokemon={p} />
        ))}
      </div>
    )
  }
}

export default CardList
