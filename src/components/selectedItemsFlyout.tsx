import { clearAll, selectSelectedCount, selectSelectedItems } from '../store/selectedItemsSlice.ts'
import { useAppDispatch, useAppSelector } from '../store/hooks.ts'
import { downloadSelectedItemsCsv } from '../utils/downloadSelectedCsv.ts'

import '../styles/selectedItemsFlyout.css'

export default function SelectedItemsFlyout() {
  const dispatch = useAppDispatch()
  const selectedCount = useAppSelector(selectSelectedCount)
  const selectedItems = useAppSelector(selectSelectedItems)

  if (selectedCount === 0) {
    return null
  }

  const handleUnselectAll = () => {
    dispatch(clearAll())
  }

  const handleDownload = () => {
    downloadSelectedItemsCsv(selectedItems)
  }

  return (
    <aside className="selected-items-flyout" aria-label="Selected items">
      <p className="selected-items-flyout__count">
        {selectedCount} {selectedCount === 1 ? 'item' : 'items'} selected
      </p>
      <div className="selected-items-flyout__actions">
        <button type="button" className="selected-items-flyout__button" onClick={handleUnselectAll}>
          Unselect all
        </button>
        <button type="button" className="selected-items-flyout__button" onClick={handleDownload}>
          Download
        </button>
      </div>
    </aside>
  )
}
