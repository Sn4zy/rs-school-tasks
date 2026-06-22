'use client'

import { Component, type ErrorInfo, type ReactNode } from 'react'

import RouteErrorFallback from './routeErrorFallback.tsx'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

export default class PokedexErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[RouteError]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return <RouteErrorFallback />
    }

    return this.props.children
  }
}
