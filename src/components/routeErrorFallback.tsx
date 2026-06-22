'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation.ts'
import '@/styles/error-shared.css'
import '@/styles/nav.css'
import '@/styles/routeErrorFallback.css'

export default function RouteErrorFallback() {
  const t = useTranslations('errors')
  const nav = useTranslations('nav')

  return (
    <main className="route-error-content">
      <div className="error-boundary-content">
        <p className="error-boundary-message">{t('somethingWrong')}</p>
        <Link href="/?page=1" className="nav-link">
          {nav('backToPokedex')}
        </Link>
      </div>
    </main>
  )
}
