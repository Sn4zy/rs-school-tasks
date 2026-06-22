import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import '@/styles/nav.css'
import '@/styles/notFoundPage.css'

type Props = {
  locale: string
}

export default async function NotFoundPage({ locale }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('notFound')
  const nav = await getTranslations('nav')

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
