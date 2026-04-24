import React, { createContext, useContext, useState, useCallback, useRef } from 'react'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [tokens, setTokens] = useState(() => {
    try {
      return {
        access: localStorage.getItem('access') || null,
        refresh: localStorage.getItem('refresh') || null,
      }
    } catch { return { access: null, refresh: null } }
  })
  const [user, setUser] = useState(null)
  const [baseUrl, setBaseUrl] = useState(() =>
    localStorage.getItem('baseUrl') || 'http://127.0.0.1:8000/api'
  )

  const saveTokens = useCallback((access, refresh) => {
    localStorage.setItem('access', access || '')
    if (refresh) localStorage.setItem('refresh', refresh)
    setTokens({ access, refresh: refresh || tokens.refresh })
  }, [tokens.refresh])

  const logout = useCallback(() => {
    localStorage.removeItem('access')
    localStorage.removeItem('refresh')
    setTokens({ access: null, refresh: null })
    setUser(null)
  }, [])

  const updateBaseUrl = useCallback((url) => {
    const clean = url.replace(/\/$/, '')
    localStorage.setItem('baseUrl', clean)
    setBaseUrl(clean)
  }, [])

  return (
    <AuthContext.Provider value={{ tokens, saveTokens, logout, user, setUser, baseUrl, updateBaseUrl }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  return useContext(AuthContext)
}
