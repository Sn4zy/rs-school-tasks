import { Component } from 'react'

interface State {
  shouldCrash: boolean
}

class ErrorThrower extends Component<Record<string, never>, State> {
  state: State = { shouldCrash: false }

  handleClick(): void {
    this.setState({ shouldCrash: true })
  }

  render() {
    if (this.state.shouldCrash) {
      throw new Error('Deliberate error (ErrorThrower test button)')
    }

    return (
      <button type="button" className="error-throw-button" onClick={() => this.handleClick()}>
        Trigger Error
      </button>
    )
  }
}

export default ErrorThrower
