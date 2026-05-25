import { useEffect, useMemo, useState, type ReactNode } from 'react'

import { ThemeContext, type Theme } from './themeContext.ts'

type ThemeProviderProps = {
  children: ReactNode
  initialTheme?: Theme
}

export function ThemeProvider({ children, initialTheme = 'light' }: ThemeProviderProps) {
  const [theme, setTheme] = useState<Theme>(initialTheme)

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    return () => {
      delete document.documentElement.dataset.theme
    }
  }, [theme])

  const value = useMemo(() => ({ theme, setTheme }), [theme])

  return <ThemeContext.Provider value={value}>{children}</ThemeContext.Provider>
}
