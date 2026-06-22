'use client'

import { useEffect } from 'react'
import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation.ts'
import '@/styles/error-shared.css'
import '@/styles/nav.css'
import '@/styles/routeErrorFallback.css'

type Props = {
  error: Error & { digest?: string }
  reset: () => void
}

export default function Error({ error, reset }: Props) {
  const t = useTranslations('errors')
  const nav = useTranslations('nav')

  useEffect(() => {
    console.error('[RouteError]', error.message, error)
  }, [error])

  return (
    <main className="route-error-content">
      <div className="error-boundary-content">
        <p className="error-boundary-message">{t('somethingWrong')}</p>
        <button type="button" onClick={reset}>
          {t('tryAgain')}
        </button>
        <Link href="/?page=1" className="nav-link">
          {nav('backToPokedex')}
        </Link>
      </div>
    </main>
  )
}
