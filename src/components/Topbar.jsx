import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { getUserRole, ROLE_LABELS } from '../config/navigation'

export default function Topbar() {
  const { tokens, logout, user, baseUrl, updateBaseUrl } = useAuth()
  const [editUrl, setEditUrl] = useState(baseUrl)

  const role = getUserRole(user)
  const roleLabel = role ? ROLE_LABELS[role] || role : null
  const username = user?.username || (tokens.access ? 'Conta conectada' : 'Visitante')

  return (
    <header className="topbar">
      <div className="topbar-intro">
        <span className="topbar-kicker">Painel da cozinha ao caixa</span>
        <div className="topbar-title-row">
          <h1 className="topbar-title">Raízes do Nordeste</h1>
          <span className="topbar-pill">food ops</span>
        </div>
      </div>

      <div className="topbar-url">
        <label htmlFor="baseUrl">Base da API</label>
        <input
          id="baseUrl"
          value={editUrl}
          onChange={event => setEditUrl(event.target.value)}
          onBlur={() => updateBaseUrl(editUrl)}
          onKeyDown={event => event.key === 'Enter' && updateBaseUrl(editUrl)}
        />
      </div>

      <div className="topbar-user">
        <div className="topbar-user-copy">
          <span className="topbar-user-name">{username}</span>
          <span className="topbar-user-status">
            {tokens.access ? roleLabel || 'Perfil em carregamento' : 'Acesso publico'}
          </span>
        </div>

        {role && <span className={`role-badge role-${role}`}>{roleLabel}</span>}

        {tokens.access && (
          <button className="danger" onClick={logout}>
            Sair
          </button>
        )}
      </div>
    </header>
  )
}
