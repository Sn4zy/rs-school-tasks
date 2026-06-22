import { screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'

import { openPokemonDetailsAction } from '@/actions/pokedex'
import type { PokemonDetails } from '../../types/index.ts'
import Card from '../components/card.tsx'
import { selectIsItemSelected } from '../store/selectedItemsSlice.ts'
import { setupStore } from '../store/store.ts'
import { renderWithProviders, renderWithSearchParams } from './testUtils.tsx'

const pikachu: PokemonDetails = {
  id: 25,
  name: 'pikachu',
  sprite: 'https://example.com/pikachu.png',
  flavorText: 'It stores electricity in its cheeks.',
}

function renderCard(
  props: Partial<Parameters<typeof Card>[0]> = {},
  options?: { store?: ReturnType<typeof setupStore> },
) {
  const store = options?.store ?? setupStore()
  const view = renderWithProviders(
    <Card
      pokemon={pikachu}
      detailsOpenId={null}
      page={1}
      query=""
      openDetailsAction={openPokemonDetailsAction}
      {...props}
    />,
    { store },
  )
  return { ...view, store }
}

describe('Card', () => {
  describe('rendering', () => {
    it('displays item name and description correctly', () => {
      const { container } = renderCard()

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('pikachu')
      expect(screen.getByText('It stores electricity in its cheeks.')).toBeInTheDocument()
      expect(container.querySelector('.pokemon-sprite')).toHaveAttribute(
        'src',
        'https://example.com/pikachu.png',
      )
      expect(screen.getByRole('checkbox', { name: /select pikachu/i })).toBeInTheDocument()
    })

    it('handles missing props gracefully', () => {
      const pokemonWithEmptyFields: PokemonDetails = {
        id: 0,
        name: '',
        sprite: '',
        flavorText: '',
      }

      const { container } = renderCard({ pokemon: pokemonWithEmptyFields })

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('')
      expect(screen.getByRole('paragraph')).toHaveTextContent('')
      expect(screen.getByRole('checkbox', { name: /select pokémon/i })).toBeInTheDocument()

      const spriteEl = container.querySelector('.pokemon-sprite')
      expect(spriteEl).toBeInTheDocument()
      expect(spriteEl?.hasAttribute('src')).toBe(false)
    })
  })

  describe('selection', () => {
    it('toggles Redux selection when checkbox is clicked', async () => {
      const user = userEvent.setup()
      const { store } = renderCard()

      await user.click(screen.getByRole('checkbox'))

      expect(selectIsItemSelected(25)(store.getState())).toBe(true)
      expect(screen.getByRole('article')).toHaveClass('pokemon-card--selected')
    })

    it('submits the open-details server action when the card body is clicked', async () => {
      const user = userEvent.setup()
      const { router } = renderWithSearchParams(
        <Card
          pokemon={pikachu}
          detailsOpenId={null}
          page={1}
          query=""
          openDetailsAction={openPokemonDetailsAction}
        />,
        ['/?page=1'],
      )

      await user.click(screen.getByRole('heading', { level: 3 }))

      await waitFor(() => {
        expect(router.state.location.pathname).toBe('/details')
        expect(router.state.location.search).toContain('details=25')
      })
    })
  })
})
