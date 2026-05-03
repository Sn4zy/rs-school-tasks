import { Component } from 'react'

interface Props {
  label?: string
}

class Loading extends Component<Props> {
  render() {
    const label = this.props.label ?? 'Loading…'

    return (
      <div className="loading-panel">
        <div className="loading-spinner" />
        <span>{label}</span>
      </div>
    )
  }
}

export default Loading
