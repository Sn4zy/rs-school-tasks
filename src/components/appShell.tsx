import { Outlet } from 'react-router-dom'

import '../styles/appShell.css'
import Header from './header.tsx'

export default function AppShell() {
  return (
    <div className="app-shell">
      <Header />
      <div className="app-content">
        <Outlet />
      </div>
    </div>
  )
}
