'use client'

import { useEffect, useRef, useState, type ChangeEvent } from 'react'
import { useTranslations } from 'next-intl'

import { useLocalStorage } from '../hooks/useLocalStorage.ts'
import '../styles/search.css'
import { SEARCH_STORAGE_KEY } from '../utils/searchStorage.ts'

interface Props {
  committedQuery: string
  onCommittedSearch: (trimmed: string) => void
}

export default function Search({ committedQuery, onCommittedSearch }: Props) {
  const t = useTranslations('search')
  const [storedSearch, setStoredSearch] = useLocalStorage(SEARCH_STORAGE_KEY, '')
  const [draft, setDraft] = useState(committedQuery)
  const didSyncStorage = useRef(false)

  useEffect(() => {
    if (didSyncStorage.current) {
      return
    }
    didSyncStorage.current = true
    setDraft(storedSearch)
    if (storedSearch.trim() !== committedQuery.trim()) {
      onCommittedSearch(storedSearch.trim())
    }
  }, [storedSearch, committedQuery, onCommittedSearch])

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setDraft(event.target.value)
  }

  const handleSearchClick = () => {
    const trimmed = draft.trim()

    if (trimmed === committedQuery.trim()) {
      return
    }

    setStoredSearch(trimmed)
    onCommittedSearch(trimmed)
  }

  return (
    <div className="search-controls">
      <label className="search-label" htmlFor="pokemon-search-input">
        {t('label')}
      </label>
      <div className="search-row">
        <input
          id="pokemon-search-input"
          type="text"
          className="search-input"
          value={draft}
          onChange={handleChange}
          placeholder={t('placeholder')}
          autoComplete="off"
        />
        <button type="button" className="search-button" onClick={handleSearchClick}>
          {t('button')}
        </button>
      </div>
    </div>
  )
}
