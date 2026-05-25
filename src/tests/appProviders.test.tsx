import { render, screen } from '@testing-library/react'
import { useSelector } from 'react-redux'

import AppProviders from '../providers/appProviders.tsx'
import { selectSelectedCount } from '../store/selectedItemsSlice.ts'

function SelectedCountProbe() {
  const count = useSelector(selectSelectedCount)
  return <p>Selected count: {count}</p>
}

describe('AppProviders', () => {
  it('provides the Redux store to the component tree', () => {
    render(
      <AppProviders>
        <SelectedCountProbe />
      </AppProviders>,
    )

    expect(screen.getByText('Selected count: 0')).toBeInTheDocument()
  })
})
