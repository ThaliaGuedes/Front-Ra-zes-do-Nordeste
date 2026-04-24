import React, { useEffect, useState } from 'react'
import { AuthProvider, useAuth } from './context/AuthContext'
import { canAccessPage, getFirstAvailablePage } from './config/navigation'
import { apiCall } from './services/http'
import { setAuthRef } from './services/http'
import Topbar from './components/Topbar'
import Sidebar from './components/Sidebar'
import AuthPage from './pages/AuthPage'
import CatalogPage from './pages/CatalogPage'
import ProdutosPage from './pages/ProdutosPage'
import EstoquePage from './pages/EstoquePage'
import PedidosPage from './pages/PedidosPage'
import FidelidadePage from './pages/FidelidadePage'

function AppInner() {
  const [active, setActive] = useState('auth')
  const auth = useAuth()
  const { tokens, user, setUser } = auth

  // Wire up the HTTP client with auth state
  useEffect(() => {
    setAuthRef(auth)
  }, [auth])

  useEffect(() => {
    let ignore = false

    async function loadUser() {
      if (!tokens.access) {
        setUser(null)
        return
      }

      if (user) return

      const result = await apiCall('/usuarios/me/')
      if (!ignore) {
        if (result.ok) setUser(result.data)
        else if (result.status === 401) setUser(null)
      }
    }

    loadUser()

    return () => {
      ignore = true
    }
  }, [tokens.access, user, setUser])

  useEffect(() => {
    if (!canAccessPage(active, tokens, user)) {
      setActive(getFirstAvailablePage(tokens, user))
    }
  }, [active, tokens, user])

  const pages = {
    auth: <AuthPage />,
    catalog: <CatalogPage />,
    produtos: <ProdutosPage />,
    estoque: <EstoquePage />,
    pedidos: <PedidosPage />,
    fidelidade: <FidelidadePage />,
  }

  return (
    <div className="app-shell">
      <Topbar />
      <div className="main-content">
        <Sidebar active={active} setActive={setActive} />
        <div className="page-area">
          {pages[active] || null}
        </div>
      </div>
    </div>
  )
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  )
}
