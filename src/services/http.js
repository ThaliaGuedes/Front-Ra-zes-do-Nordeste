// Centralized HTTP client
// - Injects Authorization: Bearer <access>
// - On 401, tries refresh once, then retries or logs out

let _authRef = null
export function setAuthRef(ref) { _authRef = ref }

async function refreshTokens(baseUrl, refreshToken) {
  const res = await fetch(`${baseUrl}/auth/token/refresh/`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ refresh: refreshToken }),
  })
  if (!res.ok) throw new Error('Refresh failed')
  return res.json()
}

export async function apiFetch(path, options = {}) {
  const { baseUrl, tokens, saveTokens, logout } = _authRef || {}
  const url = path.startsWith('http') ? path : `${baseUrl}${path}`

  const makeHeaders = (accessToken) => {
    const h = { 'Content-Type': 'application/json', ...(options.headers || {}) }
    if (accessToken) h['Authorization'] = `Bearer ${accessToken}`
    return h
  }

  const doFetch = (token) =>
    fetch(url, {
      ...options,
      headers: makeHeaders(token),
      body: options.body ? (typeof options.body === 'string' ? options.body : JSON.stringify(options.body)) : undefined,
    })

  let res = await doFetch(tokens?.access)

  // Auto-refresh on 401
  if (res.status === 401 && tokens?.refresh) {
    try {
      const refreshed = await refreshTokens(baseUrl, tokens.refresh)
      saveTokens(refreshed.access, refreshed.refresh || tokens.refresh)
      res = await doFetch(refreshed.access)
    } catch {
      logout?.()
    }
  }

  return res
}

// Helper that returns { status, data, ok, error, payload }
export async function apiCall(path, method = 'GET', body = null) {
  const options = { method }
  if (body !== null) {
    options.body = typeof body === 'string' ? body : JSON.stringify(body)
  }

  try {
    const res = await apiFetch(path, options)
    let data
    const ct = res.headers.get('content-type') || ''
    if (ct.includes('application/json')) {
      data = await res.json()
    } else {
      data = await res.text()
    }
    return {
      status: res.status,
      ok: res.ok,
      data,
      error: res.ok ? null : (typeof data === 'object' ? JSON.stringify(data) : data),
      payload: body,
    }
  } catch (e) {
    return { status: 0, ok: false, data: null, error: e.message, payload: body }
  }
}
