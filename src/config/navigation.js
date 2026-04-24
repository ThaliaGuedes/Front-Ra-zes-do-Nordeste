export const ROLE_LABELS = {
  ADMIN: 'Admin',
  GERENTE: 'Gerente',
  ATENDENTE: 'Atendente',
  COZINHA: 'Cozinha',
  CLIENTE: 'Cliente',
}

export const PAGE_ACCESS = {
  auth: { requiresAuth: false },
  catalog: { requiresAuth: false },
  produtos: { requiresAuth: true, roles: ['GERENTE', 'ADMIN'] },
  estoque: { requiresAuth: true, roles: ['GERENTE', 'ADMIN'] },
  pedidos: { requiresAuth: true, roles: ['CLIENTE', 'ATENDENTE', 'COZINHA', 'GERENTE', 'ADMIN'] },
  fidelidade: { requiresAuth: true, roles: ['CLIENTE', 'GERENTE', 'ADMIN'] },
}

export const NAV_GROUPS = [
  {
    group: 'Conta',
    items: [
      { id: 'auth', label: 'Entrar ou criar conta' },
    ],
  },
  {
    group: 'Explorar',
    items: [
      { id: 'catalog', label: 'Cardapio e unidades' },
    ],
  },
  {
    group: 'Operacao',
    items: [
      { id: 'pedidos', label: 'Pedidos', requiresAuth: true },
      { id: 'fidelidade', label: 'Fidelidade', requiresAuth: true, roles: ['CLIENTE', 'GERENTE', 'ADMIN'] },
    ],
  },
  {
    group: 'Gestao',
    items: [
      { id: 'produtos', label: 'Produtos', requiresAuth: true, roles: ['GERENTE', 'ADMIN'] },
      { id: 'estoque', label: 'Estoque', requiresAuth: true, roles: ['GERENTE', 'ADMIN'] },
    ],
  },
]

export function getUserRole(user) {
  return user?.perfil || user?.role || null
}

export function canAccessPage(pageId, tokens, user) {
  const page = PAGE_ACCESS[pageId]
  if (!page) return false
  if (!page.requiresAuth) return true
  if (!tokens?.access) return false

  const role = getUserRole(user)
  if (!page.roles?.length) return true
  if (!role) return false

  return page.roles.includes(role)
}

export function getFirstAvailablePage(tokens, user) {
  const orderedPages = ['catalog', 'auth', 'pedidos', 'fidelidade', 'produtos', 'estoque']
  return orderedPages.find(pageId => canAccessPage(pageId, tokens, user)) || 'auth'
}
