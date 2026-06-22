'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import '../styles/errorThrower.css'

export default function ErrorThrower() {
  const t = useTranslations('errors')
  const [shouldCrash, setShouldCrash] = useState(false)

  if (shouldCrash) {
    throw new Error('Deliberate error (ErrorThrower test button)')
  }

  return (
    <button
      type="button"
      className="error-throw-button"
      onClick={() => setShouldCrash(true)}
    >
      {t('triggerError')}
    </button>
  )
}
