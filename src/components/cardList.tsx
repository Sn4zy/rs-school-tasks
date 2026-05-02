import { Component } from 'react'
import type { PokemonDetails } from '../../types/index.ts'
import Card from './card.tsx'

interface Props {
    pokemon: PokemonDetails[]
}

class CardList extends Component<Props> {
    render() {
        const { pokemon } = this.props
        return (
            <div className="card-list">
                {pokemon.map((pokemon) => (
                    <Card key={pokemon.id} pokemon={pokemon} />
                ))}
            </div>
        )
    }
}
export default CardList