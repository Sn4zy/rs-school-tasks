import { getTranslations, setRequestLocale } from 'next-intl/server'

import { closePokemonDetailsAction, refreshSearchAction } from '@/actions/pokedex'
import type { PokemonDetails } from '../../types/index.ts'
import '../styles/card.css'
import '../styles/error-shared.css'
import '../styles/pokemonDetailsPanel.css'
import PokemonSprite from '@/components/pokemonSprite'

type Props = {
  locale: string
  pokemon: PokemonDetails | null
  errorMessage: string | null
  page: number
  query: string
}

export default async function PokemonDetailsPanelView({
  locale,
  pokemon,
  errorMessage,
  page,
  query,
}: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('details')

  return (
    <aside className="details-panel" aria-label={t('panelAria')}>
      <div className="details-panel-header">
        <h2 className="details-panel-heading">{t('heading')}</h2>
        <div className="details-panel-actions">
          <form action={refreshSearchAction}>
            <button type="submit" className="refresh-button" aria-label={t('refreshAria')}>
              {t('refresh')}
            </button>
          </form>
          <form action={closePokemonDetailsAction}>
            <input type="hidden" name="page" value={String(page)} />
            <input type="hidden" name="q" value={query} />
            <button type="submit" className="details-close-button">
              {t('close')}
            </button>
          </form>
        </div>
      </div>

      {errorMessage ? (
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
