import { Component } from 'react'

interface Props {
  label?: string
}

class Loading extends Component<Props> {
  render() {
    const label = this.props.label ?? 'Loading…'

    return (
      <div className="loading-panel" role="status" aria-live="polite">
        <div className="loading-spinner" aria-label="Loading" />
        <span>{label}</span>
      </div>
    )
  }
}

export default Loading
