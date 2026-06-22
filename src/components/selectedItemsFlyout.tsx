'use client'

import { useState } from 'react'
import { useTranslations } from 'next-intl'

import { generateSelectedItemsCsvAction } from '@/actions/downloadSelectedCsv'
import { triggerCsvDownload } from '@/utils/triggerCsvDownload'
import { clearAll, selectSelectedCount, selectSelectedItems } from '../store/selectedItemsSlice.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'

import '../styles/selectedItemsFlyout.css'

export default function SelectedItemsFlyout() {
  const t = useTranslations('flyout')
  const dispatch = useAppDispatch()
  const selectedCount = useAppSelector(selectSelectedCount)
  const selectedItems = useAppSelector(selectSelectedItems)
  const [isDownloading, setIsDownloading] = useState(false)

  if (selectedCount === 0) {
    return null
  }

  const handleUnselectAll = () => {
    dispatch(clearAll())
  }

  const handleDownload = async () => {
    setIsDownloading(true)

    try {
      const result = await generateSelectedItemsCsvAction(selectedItems)

      if (result) {
        triggerCsvDownload(result.csv, result.filename)
      }
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <aside className="selected-items-flyout" aria-label={t('aria')}>
      <p className="selected-items-flyout__count">
        {selectedCount === 1
          ? t('countOne', { count: selectedCount })
          : t('countMany', { count: selectedCount })}
      </p>
      <div className="selected-items-flyout__actions">
        <button type="button" className="selected-items-flyout__button" onClick={handleUnselectAll}>
          {t('unselectAll')}
        </button>
        <button
          type="button"
          className="selected-items-flyout__button"
          onClick={handleDownload}
          disabled={isDownloading}
        >
          {t('download')}
        </button>
      </div>
    </aside>
  )
}
