'use client'

import { NextIntlClientProvider, type AbstractIntlMessages } from 'next-intl'
import type { ReactNode } from 'react'

import type { AppLocale } from '@/i18n/routing'
import AppProviders from './appProviders'

type Props = {
  children: ReactNode
  locale: AppLocale
  messages: AbstractIntlMessages
}

export default function LocaleProviders({ children, locale, messages }: Props) {
  return (
    <NextIntlClientProvider locale={locale} messages={messages}>
      <AppProviders>{children}</AppProviders>
    </NextIntlClientProvider>
  )
}
