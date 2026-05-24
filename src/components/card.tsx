import type { KeyboardEvent, MouseEvent } from 'react'

import type { PokemonDetails } from '../../types/index.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { selectIsItemSelected, toggleItem } from '../store/selectedItemsSlice.ts'

import '../styles/card.css'

type Props = {
  pokemon: PokemonDetails
  detailsOpenId: number | null
  onOpenDetails: (id: number) => void
}

export default function Card({ pokemon, detailsOpenId, onOpenDetails }: Props) {
  const { id, name, sprite, flavorText } = pokemon
  const dispatch = useAppDispatch()
  const isChecked = useAppSelector(selectIsItemSelected(id))
  const isDetailsOpen = detailsOpenId === id
  const spriteSrc = sprite.trim() !== '' ? sprite : undefined

  const handleToggleChecked = () => {
    dispatch(toggleItem(pokemon))
  }

  const handleCheckboxClick = (event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation()
  }

  const handleOpenDetails = () => {
    onOpenDetails(id)
  }

  const handleBodyKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenDetails()
    }
  }

  return (
    <article
      className={`pokemon-card${isChecked ? ' pokemon-card--selected' : ''}${
        isDetailsOpen ? ' pokemon-card--details-open' : ''
      }`}
    >
      <input
        type="checkbox"
        className="pokemon-card__checkbox"
        checked={isChecked}
        onChange={handleToggleChecked}
        onClick={handleCheckboxClick}
        aria-label={`Select ${name || 'Pokémon'}`}
      />
      <div
        className="pokemon-card__body"
        role="button"
        tabIndex={0}
        onClick={handleOpenDetails}
        onKeyDown={handleBodyKeyDown}
      >
        <img className="pokemon-sprite" src={spriteSrc} alt="" />
        <h3 className="pokemon-name">{name}</h3>
        <p className="pokemon-description">{flavorText}</p>
      </div>
    </article>
  )
}
