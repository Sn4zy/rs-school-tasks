import { configureStore } from '@reduxjs/toolkit'

import selectedItemsReducer, { type SelectedItemsState } from './selectedItemsSlice.ts'

export type RootState = {
  selectedItems: SelectedItemsState
}

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: {
      selectedItems: selectedItemsReducer,
    },
    preloadedState,
  })
}

export const store = setupStore()

export type AppStore = ReturnType<typeof setupStore>
export type AppDispatch = AppStore['dispatch']
