'use client'

import { useTranslations } from 'next-intl'
import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import { closePokemonDetailsAction } from '@/actions/pokedex'
import { fetchPokemonDetails } from '../../api/pokemon.ts'
import type { PokemonDetails } from '../../types/index.ts'
import { parsePageParam, parseQueryParam } from '@/utils/urlParams'
import '../styles/card.css'
import '../styles/error-shared.css'
import '../styles/pokemonDetailsPanel.css'
import Loading from './Loading.tsx'
import PokemonSprite from './pokemonSprite.tsx'

type ContentProps = {
  detailsId: string
  page: number
  query: string
}

function PokemonDetailsContent({ detailsId, page, query }: ContentProps) {
  const t = useTranslations('details')
  const [pokemon, setPokemon] = useState<PokemonDetails | null>(null)
  const [errorMessage, setErrorMessage] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    let cancelled = false

    void fetchPokemonDetails(detailsId)
      .then((data) => {
        if (!cancelled) {
          setPokemon(data)
        }
      })
      .catch((error: unknown) => {
        if (!cancelled) {
          setPokemon(null)
          setErrorMessage(error instanceof Error ? error.message : t('loadError'))
        }
      })
      .finally(() => {
        if (!cancelled) {
          setIsLoading(false)
        }
      })

    return () => {
      cancelled = true
    }
  }, [detailsId, t])

  const closeDetails = () => {
    const formData = new FormData()
    formData.set('page', String(page))
    formData.set('q', query)
    void closePokemonDetailsAction(formData)
  }

  return (
    <aside className="details-panel" aria-label={t('panelAria')}>
      <div className="details-panel-header">
        <h2 className="details-panel-heading">{t('heading')}</h2>
        <div className="details-panel-actions">
          <button type="button" className="details-close-button" onClick={closeDetails}>
            {t('close')}
          </button>
        </div>
      </div>

      {isLoading ? (
        <Loading labelKey="details" />
      ) : errorMessage ? (
        <div className="error-panel">{errorMessage}</div>
      ) : pokemon ? (
        <article className="pokemon-card pokemon-card--detail">
          <PokemonSprite src={pokemon.sprite} />
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <p className="pokemon-description">{pokemon.flavorText}</p>
          <p className="pokemon-id">{t('id', { id: pokemon.id })}</p>
        </article>
      ) : null}
    </aside>
  )
}

export default function PokemonDetailsPanelClient() {
  const searchParams = useSearchParams()
  const detailsId = searchParams?.get('details') ?? null
  const page = parsePageParam(searchParams?.get('page') ?? null)
  const query = parseQueryParam(searchParams?.get('q') ?? null)

  if (!detailsId) {
    return null
  }

  return <PokemonDetailsContent key={detailsId} detailsId={detailsId} page={page} query={query} />
}
