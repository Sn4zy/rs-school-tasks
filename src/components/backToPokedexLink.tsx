'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'

export default function BackToPokedexLink() {
  const nav = useTranslations('nav')

  return (
    <Link href="/?page=1" className="nav-link">
      {nav('backToPokedex')}
    </Link>
  )
}
