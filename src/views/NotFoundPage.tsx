import { getTranslations } from 'next-intl/server'

import BackToPokedexLink from '@/components/backToPokedexLink'
import '@/styles/nav.css'
import '@/styles/notFoundPage.css'

export default async function NotFoundPage() {
  const t = await getTranslations('notFound')

  return (
    <main className="not-found-page">
      <section className="not-found-content">
        <h2>{t('title')}</h2>
        <p>{t('description')}</p>
      </section>

      <p>
        <BackToPokedexLink />
      </p>
    </main>
  )
}
