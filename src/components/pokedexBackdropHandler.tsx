'use client'

import { useCallback, type MouseEvent, type ReactNode } from 'react'

import { closePokemonDetailsAction } from '@/actions/pokedex'

type Props = {
  showDetailsPanel: boolean
  page: number
  query: string
  children: ReactNode
  onBackdropClose?: () => void
}

export default function PokedexBackdropHandler({
  showDetailsPanel,
  page,
  query,
  children,
  onBackdropClose,
}: Props) {
  const handleMainPanelClick = useCallback(
    (event: MouseEvent<HTMLElement>) => {
      if (!showDetailsPanel) {
        return
      }

      const target = event.target
      if (!(target instanceof HTMLElement)) {
        return
      }

      if (target.closest('.pokemon-card, .pagination, .search-controls, .details-panel')) {
        return
      }

      if (onBackdropClose) {
        onBackdropClose()
        return
      }

      const form = event.currentTarget.querySelector<HTMLFormElement>('[data-close-details-form]')
      form?.requestSubmit()
    },
    [showDetailsPanel, onBackdropClose],
  )

  return (
    <main className="main-page" onClick={handleMainPanelClick}>
      {children}
      {showDetailsPanel && !onBackdropClose ? (
        <form action={closePokemonDetailsAction} data-close-details-form hidden>
          <input type="hidden" name="page" value={String(page)} />
          <input type="hidden" name="q" value={query} />
        </form>
      ) : null}
    </main>
  )
}
