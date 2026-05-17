import { useCallback, useState } from 'react'

export function useLocalStorage(
  key: string,
  initialValue = '',
): readonly [string, (value: string) => void] {
  const [storedValue, setStoredValue] = useState(() => {
    try {
      return localStorage.getItem(key) ?? initialValue
    } catch {
      return initialValue
    }
  })

  const setValue = useCallback(
    (value: string) => {
      try {
        localStorage.setItem(key, value)
      } catch {
        // localStorage may be unavailable (private mode, quota, etc.)
      }
      setStoredValue(value)
    },
    [key],
  )

  return [storedValue, setValue] as const
}
