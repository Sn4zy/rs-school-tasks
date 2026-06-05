import { combineReducers, configureStore } from '@reduxjs/toolkit'

import { pokemonApi } from '../api/pokemonApi.ts'
import selectedItemsReducer from './selectedItemsSlice.ts'

const rootReducer = combineReducers({
  [pokemonApi.reducerPath]: pokemonApi.reducer,
  selectedItems: selectedItemsReducer,
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
})

export type RootState = ReturnType<typeof rootReducer>
export type AppDispatch = typeof store.dispatch

export function setupStore(preloadedState?: Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(pokemonApi.middleware),
    preloadedState,
  })
}

export type AppStore = ReturnType<typeof setupStore>
