import { combineReducers, configureStore } from '@reduxjs/toolkit'

import selectedItemsReducer from './selectedItemsSlice.ts'

const rootReducer = combineReducers({
  selectedItems: selectedItemsReducer,
})

export const store = configureStore({
  reducer: rootReducer,
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
  })
}

export type AppStore = ReturnType<typeof setupStore>
