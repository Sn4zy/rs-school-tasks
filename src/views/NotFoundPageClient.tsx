'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import '@/styles/nav.css'
import '@/styles/notFoundPage.css'

export default function NotFoundPageClient() {
  const t = useTranslations('notFound')
  const nav = useTranslations('nav')

  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </section>

      <p>
        <Link href="/?page=1" className="nav-link">
          {nav('backToPokedex')}
        </Link>
      </p>
    </main>
  )
}
