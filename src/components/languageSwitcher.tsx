'use client'

import type { ChangeEvent } from 'react'
import { useLocale, useTranslations } from 'next-intl'

import { usePathname, useRouter } from '@/i18n/navigation.ts'
import { routing, type AppLocale } from '@/i18n/routing.ts'
import '../styles/header.css'

export default function LanguageSwitcher() {
  const t = useTranslations('language')
  const locale = useLocale() as AppLocale
  const router = useRouter()
  const pathname = usePathname()

  const handleChange = (event: ChangeEvent<HTMLSelectElement>) => {
    router.replace(pathname, { locale: event.target.value as AppLocale })
  }

  return (
    <label className="language-select-label">
      {t('label')}
      <select
        className="language-select"
        value={locale}
        onChange={handleChange}
        aria-label={t('label')}
      >
        {routing.locales.map((value) => (
          <option key={value} value={value}>
            {t(value)}
          </option>
        ))}
      </select>
    </label>
  )
}
