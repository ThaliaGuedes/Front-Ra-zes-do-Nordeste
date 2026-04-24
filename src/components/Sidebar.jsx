import React from 'react'
import { useAuth } from '../context/AuthContext'
import { canAccessPage, getUserRole, NAV_GROUPS, ROLE_LABELS } from '../config/navigation'

export default function Sidebar({ active, setActive }) {
  const { tokens, user } = useAuth()
  const role = getUserRole(user)
  const roleLabel = role ? ROLE_LABELS[role] || role : null

  const visibleGroups = NAV_GROUPS
    .map(group => ({
      ...group,
      items: group.items.filter(item => canAccessPage(item.id, tokens, user)),
    }))
    .filter(group => group.items.length > 0)

  return (
    <nav className="sidebar">
      <div className="sidebar-brand">
        <span className="sidebar-brand-kicker">Lanchonete</span>
        <strong>Raízes do Nordeste</strong>
        <p>{roleLabel ? `Painel de ${roleLabel.toLowerCase()}` : 'Escolha uma area para navegar'}</p>
      </div>

      {visibleGroups.map(group => (
        <div className="sidebar-group" key={group.group}>
          <div className="sidebar-group-label">{group.group}</div>
          {group.items.map(item => (
            <button
              key={item.id}
              className={`sidebar-item${active === item.id ? ' active' : ''}`}
              onClick={() => setActive(item.id)}
            >
              {item.label}
            </button>
          ))}
        </div>
      ))}
    </nav>
  )
}
