'use client'

import { useState, type ReactNode } from 'react'
import { Provider } from 'react-redux'

import { setupStore, type AppStore } from '../store/store.ts'

type Props = {
  children: ReactNode
}

export default function StoreProvider({ children }: Props) {
  const [store] = useState<AppStore>(() => setupStore())

  return <Provider store={store}>{children}</Provider>
}
