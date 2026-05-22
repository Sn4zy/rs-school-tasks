import { render, screen } from '@testing-library/react'

import type { PokemonDetails } from '../../types/index.ts'
import Card from '../components/card.tsx'

describe('Card', () => {
  describe('rendering', () => {
    it('displays item name and description correctly', () => {
      const { container } = render(
        <Card
          pokemon={{
            id: 1,
            name: 'pikachu',
            sprite: 'https://example.com/pikachu.png',
            flavorText: 'It stores electricity in its cheeks.',
          }}
          selected={false}
          onSelect={() => {}}
        />,
      )

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('pikachu')
      expect(
        screen.getByText('It stores electricity in its cheeks.'),
      ).toBeInTheDocument()

      expect(container.querySelector('.pokemon-sprite')).toHaveAttribute(
        'src',
        'https://example.com/pikachu.png',
      )
    })

    it('handles missing props gracefully', () => {
      const pokemonWithEmptyFields: PokemonDetails = {
        id: 0,
        name: '',
        sprite: '',
        flavorText: '',
      }

      const { container } = render(
        <Card pokemon={pokemonWithEmptyFields} selected={false} onSelect={() => {}} />,
      )

      expect(screen.getByRole('heading', { level: 3 })).toHaveTextContent('')
      expect(screen.getByRole('paragraph')).toHaveTextContent('')

      const spriteEl = container.querySelector('.pokemon-sprite')
      expect(spriteEl).toBeInTheDocument()
      expect(spriteEl?.hasAttribute('src')).toBe(false)
    })
  })
})
