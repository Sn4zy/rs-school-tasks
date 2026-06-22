'use client'

import { useActionState, useEffect, useRef, type FormEvent } from 'react'
import { useTranslations } from 'next-intl'

import { submitSearchAction } from '@/actions/pokedex'
import { useLocalStorage } from '../hooks/useLocalStorage.ts'
import '../styles/search.css'
import { SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'

type Props = {
  query: string
}

export default function SearchForm({ query }: Props) {
  const t = useTranslations('search')
  const [storedSearch, setStoredSearch] = useLocalStorage(SEARCH_STORAGE_KEY, '')
  const [, formAction] = useActionState(submitSearchAction, null)
  const didSyncStorage = useRef(false)

  useEffect(() => {
    if (didSyncStorage.current) {
      return
    }
    didSyncStorage.current = true

    const trimmedStored = storedSearch.trim()
    if (trimmedStored && query.trim() === '') {
      const formData = new FormData()
      formData.set('q', trimmedStored)
      void submitSearchAction(null, formData)
    }
  }, [storedSearch, query])

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    const formData = new FormData(event.currentTarget)
    setStoredSearch(String(formData.get('q') ?? '').trim())
  }

  return (
    <form
      key={query}
      action={formAction}
      className="search-controls"
      onSubmit={handleSubmit}
    >
      <label className="search-label" htmlFor="pokemon-search-input">
        {t('label')}
      </label>
      <div className="search-row">
        <input
          id="pokemon-search-input"
          name="q"
          type="text"
          className="search-input"
          defaultValue={query || storedSearch}
          placeholder={t('placeholder')}
          autoComplete="off"
        />
        <button type="submit" className="search-button">
          {t('button')}
        </button>
      </div>
    </form>
  )
}
