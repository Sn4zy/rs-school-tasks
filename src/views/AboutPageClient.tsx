'use client'

import { useTranslations } from 'next-intl'

import { Link } from '@/i18n/navigation'
import '@/styles/aboutPage.css'
import '@/styles/nav.css'

export default function AboutPageClient() {
  const t = useTranslations('about')
  const nav = useTranslations('nav')

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
