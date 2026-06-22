import { render } from '@testing-library/react'

import PokemonSprite from '../components/pokemonSprite.tsx'

describe('PokemonSprite', () => {
  it('renders a next/image-backed sprite when a URL is provided', () => {
    const { container } = render(<PokemonSprite src="https://example.com/pikachu.png" />)

    const image = container.querySelector('img.pokemon-sprite')
    expect(image).toHaveAttribute('src', 'https://example.com/pikachu.png')
  })

  it('renders a placeholder when the sprite URL is empty', () => {
    const { container } = render(<PokemonSprite src="" />)

    expect(container.querySelector('img.pokemon-sprite')).not.toBeInTheDocument()
    expect(container.querySelector('span.pokemon-sprite')).toBeInTheDocument()
  })
})
