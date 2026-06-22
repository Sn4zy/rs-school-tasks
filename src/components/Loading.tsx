'use client'

import { useTranslations } from 'next-intl'

import '../styles/Loading.css'

interface Props {
  labelKey?: 'default' | 'details'
  label?: string
}

export default function Loading({ labelKey = 'default', label }: Props) {
  const t = useTranslations('loading')
  const text = label ?? t(labelKey)

  return (
    <div className="loading-panel" role="status" aria-live="polite">
      <div className="loading-spinner" aria-label={t('aria')} />
      <span>{text}</span>
    </div>
  )
}
