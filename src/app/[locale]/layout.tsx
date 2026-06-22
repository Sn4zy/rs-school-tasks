import type { Metadata } from 'next'
import { hasLocale } from 'next-intl'
import { getMessages, getTranslations, setRequestLocale } from 'next-intl/server'
import { notFound } from 'next/navigation'

import LocaleProviders from '@/providers/localeProviders'
import { routing, type AppLocale } from '@/i18n/routing'
import '@/styles/global.css'

type Props = {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}

export function generateStaticParams() {
  return routing.locales.map((locale) => ({ locale }))
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    return {}
  }

  setRequestLocale(locale)
  const t = await getTranslations({ locale, namespace: 'app' })

  return {
    title: t('title'),
    description: t('description'),
  }
}

export default async function LocaleLayout({ children, params }: Props) {
  const { locale } = await params

  if (!hasLocale(routing.locales, locale)) {
    notFound()
  }

  setRequestLocale(locale)
  const messages = await getMessages()

  return (
    <html lang={locale}>
      <body>
        <LocaleProviders locale={locale as AppLocale} messages={messages}>
          {children}
        </LocaleProviders>
      </body>
    </html>
  )
}
