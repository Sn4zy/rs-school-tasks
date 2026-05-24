import { createSlice, type PayloadAction } from '@reduxjs/toolkit'

import type { PokemonDetails } from '../../types/index.ts'

export interface SelectedItemsState {
  itemsById: Record<number, PokemonDetails>
}

const initialState: SelectedItemsState = {
  itemsById: {},
}

const selectedItemsSlice = createSlice({
  name: 'selectedItems',
  initialState,
  reducers: {
    toggleItem(state, action: PayloadAction<PokemonDetails>) {
      const { id } = action.payload
      if (state.itemsById[id]) {
        delete state.itemsById[id]
      } else {
        state.itemsById[id] = action.payload
      }
    },
    removeItem(state, action: PayloadAction<number>) {
      delete state.itemsById[action.payload]
    },
    clearAll(state) {
      state.itemsById = {}
    },
  },
})

export const { toggleItem, removeItem, clearAll } = selectedItemsSlice.actions

type SelectedItemsRootState = { selectedItems: SelectedItemsState }

export const selectSelectedItemsState = (state: SelectedItemsRootState) => state.selectedItems

export const selectSelectedItems = (state: SelectedItemsRootState) =>
  Object.values(state.selectedItems.itemsById)

export const selectSelectedCount = (state: SelectedItemsRootState) =>
  Object.keys(state.selectedItems.itemsById).length

export const selectIsItemSelected = (id: number) => (state: SelectedItemsRootState) =>
  id in state.selectedItems.itemsById

export default selectedItemsSlice.reducer
