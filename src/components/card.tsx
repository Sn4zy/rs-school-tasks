'use client'

import type { KeyboardEvent, MouseEvent } from 'react'
import { useTranslations } from 'next-intl'

import type { PokemonDetails } from '../../types/index.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { selectIsItemSelected, toggleItem } from '../store/selectedItemsSlice.ts'
import PokemonSprite from './pokemonSprite.tsx'

import '../styles/card.css'

type Props = {
  pokemon: PokemonDetails
  detailsOpenId: number | null
  page: number
  query: string
  openDetailsAction: (formData: FormData) => void | Promise<void>
}

export default function Card({
  pokemon,
  detailsOpenId,
  page,
  query,
  openDetailsAction,
}: Props) {
  const t = useTranslations('card')
  const { id, name, sprite, flavorText } = pokemon
  const dispatch = useAppDispatch()
  const isChecked = useAppSelector(selectIsItemSelected(id))
  const isDetailsOpen = detailsOpenId === id

  const handleToggleChecked = () => {
    dispatch(toggleItem(pokemon))
  }

  const handleCheckboxClick = (event: MouseEvent<HTMLInputElement>) => {
    event.stopPropagation()
  }

  const handleOpenDetails = () => {
    const formData = new FormData()
    formData.set('detailsId', String(id))
    formData.set('page', String(page))
    formData.set('q', query)
    void openDetailsAction(formData)
  }

  const handleBodyKeyDown = (event: KeyboardEvent<HTMLButtonElement>) => {
    if (event.key === 'Enter' || event.key === ' ') {
      event.preventDefault()
      handleOpenDetails()
    }
  }

  const selectLabel = name ? t('select', { name }) : t('selectFallback')

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
        aria-label={selectLabel}
      />
      <button
        type="button"
        className="pokemon-card__body"
        onClick={handleOpenDetails}
        onKeyDown={handleBodyKeyDown}
      >
        <PokemonSprite src={sprite} />
        <h3 className="pokemon-name">{name}</h3>
        <p className="pokemon-description">{flavorText}</p>
      </button>
    </article>
  )
}
