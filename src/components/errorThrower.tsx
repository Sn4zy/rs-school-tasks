import { useState } from 'react'

import '../styles/errorThrower.css'

export default function ErrorThrower() {
  const [shouldCrash, setShouldCrash] = useState(false)

  if (shouldCrash) {
    throw new Error('Deliberate error (ErrorThrower test button)')
  }

  return (
    <button
      type="button"
      className="error-throw-button"
      onClick={() => setShouldCrash(true)}
    >
      Trigger Error
    </button>
  )
}
