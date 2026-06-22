import { getTranslations, setRequestLocale } from 'next-intl/server'

import { Link } from '@/i18n/navigation'
import '@/styles/aboutPage.css'
import '@/styles/nav.css'

type Props = {
  locale: string
}

export default async function AboutPage({ locale }: Props) {
  setRequestLocale(locale)
  const t = await getTranslations('about')
  const nav = await getTranslations('nav')

  return (
    <main className="about-page">
      <section className="about-content">
        <h2>{t('author')}</h2>
        <p>{t('description')}</p>
        <p>
          <a
            href="https://rs.school/react/"
            target="_blank"
            rel="noreferrer"
            className="about-course-link"
          >
            {t('courseLink')}
          </a>
        </p>
      </section>

      <p>
        <Link href="/?page=1" className="nav-link">
          {nav('backToPokedex')}
        </Link>
      </p>
    </main>
  )
}
