import Image from 'next/image'

const SPRITE_SIZE = 96

type Props = {
  src?: string
  className?: string
}

export default function PokemonSprite({ src, className = 'pokemon-sprite' }: Props) {
  const normalizedSrc = src?.trim() ?? ''

  if (normalizedSrc === '') {
    return <span className={className} aria-hidden />
  }

  return (
    <Image
      src={normalizedSrc}
      alt=""
      width={SPRITE_SIZE}
      height={SPRITE_SIZE}
      className={className}
    />
  )
}
