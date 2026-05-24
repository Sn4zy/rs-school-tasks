import type { ReactNode } from 'react'
import { Provider } from 'react-redux'

import { store } from '../store/store.ts'

type Props = {
  children: ReactNode
}

export default function AppProviders({ children }: Props) {
  return <Provider store={store}>{children}</Provider>
}
