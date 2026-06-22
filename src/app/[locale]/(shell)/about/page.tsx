import { setRequestLocale } from 'next-intl/server'

import AboutPage from '@/views/AboutPage'

export const dynamic = 'force-static'

type Props = {
  params: Promise<{ locale: string }>
}

export default async function AboutRoute({ params }: Props) {
  const { locale } = await params
  setRequestLocale(locale)

  return <AboutPage locale={locale} />
}
