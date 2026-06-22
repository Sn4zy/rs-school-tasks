'use client'

import { useTranslations } from 'next-intl'
import { useSearchParams } from 'next/navigation'

import {
  pokemonApi,
  pokemonDetailsCacheTag,
  usePokemonDetailsQuery,
} from '../api/pokemonApi.ts'
import { useRouter } from '@/i18n/navigation.ts'
import { useAppDispatch } from '../store/hooks.ts'
import { getReadableQueryError } from '../utils/rtkQueryError.ts'
import { buildHomePath, parsePageParam } from '../utils/urlParams.ts'
import '../styles/card.css'
import '../styles/error-shared.css'
import '../styles/pokemonDetailsPanel.css'
import Loading from './Loading.tsx'

interface ContentProps {
  detailsId: string
  page: number
}

function PokemonDetailsContent({ detailsId, page }: ContentProps) {
  const t = useTranslations('details')
  const errorsT = useTranslations('errors')
  const dispatch = useAppDispatch()
  const router = useRouter()
  const { data: pokemon, isLoading, isFetching, error, refetch } =
    usePokemonDetailsQuery(detailsId)
  const isBusy = isLoading || isFetching
  const errorMessage = getReadableQueryError(error, t('loadError'), {
    network: errorsT('network'),
    invalidResponse: errorsT('invalidResponse'),
    timeout: errorsT('timeout'),
    httpStatus: (message, status) => errorsT('httpStatus', { message, status }),
  })

  const refreshDetails = () => {
    dispatch(pokemonApi.util.invalidateTags([pokemonDetailsCacheTag(detailsId)]))
    void refetch()
  }

  const closeDetails = () => {
    router.push(buildHomePath(page))
  }

  return (
    <aside className="details-panel" aria-label={t('panelAria')}>
      <div className="details-panel-header">
        <h2 className="details-panel-heading">{t('heading')}</h2>
        <div className="details-panel-actions">
          <button
            type="button"
            className="refresh-button"
            aria-label={t('refreshAria')}
            onClick={refreshDetails}
          >
            {t('refresh')}
          </button>
          <button type="button" className="details-close-button" onClick={closeDetails}>
            {t('close')}
          </button>
        </div>
      </div>

      {isBusy ? (
        <Loading labelKey="details" />
      ) : errorMessage ? (
        <div className="error-panel">{errorMessage}</div>
      ) : pokemon ? (
        <article className="pokemon-card pokemon-card--detail">
          <img
            className="pokemon-sprite"
            src={pokemon.sprite.trim() !== '' ? pokemon.sprite : undefined}
            alt=""
          />
          <h3 className="pokemon-name">{pokemon.name}</h3>
          <p className="pokemon-description">{pokemon.flavorText}</p>
          <p className="pokemon-id">{t('id', { id: pokemon.id })}</p>
        </article>
      ) : null}
    </aside>
  )
}

export default function PokemonDetailsPanel() {
  const searchParams = useSearchParams()
  const detailsId = searchParams?.get('details') ?? null
  const page = parsePageParam(searchParams?.get('page') ?? null)

  if (!detailsId) {
    return null
  }

  return <PokemonDetailsContent key={detailsId} detailsId={detailsId} page={page} />
}
