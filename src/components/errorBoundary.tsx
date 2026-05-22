import { Component, type ErrorInfo, type ReactNode } from 'react'

import '../styles/error-shared.css'

interface Props {
  children: ReactNode
}

interface State {
  hasError: boolean
}

class ErrorBoundary extends Component<Props, State> {
  state: State = { hasError: false }

  static getDerivedStateFromError(): State {
    return { hasError: true }
  }

  componentDidCatch(error: Error, info: ErrorInfo): void {
    console.error('[ErrorBoundary]', error, info.componentStack)
  }

  render() {
    if (this.state.hasError) {
      return (
        <div className="error-boundary-root">
          <p className="error-boundary-message">Something went wrong</p>
        </div>
      )
    }

    return this.props.children
  }
}

export default ErrorBoundary
