import { describe, expect, it } from 'vitest'

import {
  clearAll,
  removeItem,
  selectIsItemSelected,
  selectSelectedCount,
  selectSelectedItems,
  toggleItem,
} from '../store/selectedItemsSlice.ts'
import { setupStore } from '../store/store.ts'
import type { PokemonDetails } from '../../types/index.ts'

const bulbasaur: PokemonDetails = {
  id: 1,
  name: 'bulbasaur',
  sprite: 'https://example.com/1.png',
  flavorText: 'A seed Pokémon.',
}

const ivysaur: PokemonDetails = {
  id: 2,
  name: 'ivysaur',
  sprite: 'https://example.com/2.png',
  flavorText: 'A seed Pokémon.',
}

describe('selectedItemsSlice', () => {
  it('starts with no selected items', () => {
    const store = setupStore()

    expect(selectSelectedCount(store.getState())).toBe(0)
    expect(selectSelectedItems(store.getState())).toEqual([])
  })

  it('adds an item when toggled on', () => {
    const store = setupStore()
    store.dispatch(toggleItem(bulbasaur))

    expect(selectSelectedCount(store.getState())).toBe(1)
    expect(selectSelectedItems(store.getState())).toEqual([bulbasaur])
    expect(selectIsItemSelected(1)(store.getState())).toBe(true)
  })

  it('removes an item when toggled off', () => {
    const store = setupStore({
      selectedItems: { itemsById: { 1: bulbasaur } },
    })
    store.dispatch(toggleItem(bulbasaur))

    expect(selectSelectedCount(store.getState())).toBe(0)
    expect(selectIsItemSelected(1)(store.getState())).toBe(false)
  })

  it('removes an item with removeItem', () => {
    const store = setupStore({
      selectedItems: { itemsById: { 1: bulbasaur, 2: ivysaur } },
    })
    store.dispatch(removeItem(1))

    expect(selectSelectedCount(store.getState())).toBe(1)
    expect(selectSelectedItems(store.getState())).toEqual([ivysaur])
  })

  it('clears all selected items', () => {
    const store = setupStore({
      selectedItems: { itemsById: { 1: bulbasaur, 2: ivysaur } },
    })
    store.dispatch(clearAll())

    expect(selectSelectedCount(store.getState())).toBe(0)
    expect(selectSelectedItems(store.getState())).toEqual([])
  })
})

describe('Redux store setup', () => {
  it('configures the selectedItems reducer', () => {
    const store = setupStore()
    store.dispatch(toggleItem(bulbasaur))

    expect(store.getState().selectedItems).toEqual({ itemsById: { 1: bulbasaur } })
  })

  it('accepts preloaded state for tests', () => {
    const store = setupStore({
      selectedItems: { itemsById: { 2: ivysaur } },
    })

    expect(selectSelectedCount(store.getState())).toBe(1)
    expect(selectIsItemSelected(2)(store.getState())).toBe(true)
  })
})
