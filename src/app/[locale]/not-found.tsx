import { getLocale, setRequestLocale } from 'next-intl/server'

import NotFoundPage from '@/views/NotFoundPage'

export default async function NotFound() {
  const locale = await getLocale()
  setRequestLocale(locale)

  return <NotFoundPage locale={locale} />
}
