const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api'

export const authStorage = {
  getToken() {
    return localStorage.getItem('mizenToken') || localStorage.getItem('token') || ''
  },
  getUser() {
    try {
      return JSON.parse(localStorage.getItem('mizenUser') || 'null')
    } catch {
      return null
    }
  },
  setSession(token, user) {
    localStorage.setItem('mizenToken', token)
    localStorage.setItem('token', token)
    localStorage.setItem('mizenUser', JSON.stringify(user))
    localStorage.setItem('mizenRole', user.role)
    localStorage.setItem('mizenAdminLoggedIn', user.role === 'admin' ? 'true' : 'false')
  },
  clearSession() {
    localStorage.removeItem('mizenToken')
    localStorage.removeItem('token')
    localStorage.removeItem('mizenUser')
    localStorage.removeItem('mizenRole')
    localStorage.removeItem('mizenAdminLoggedIn')
  },
}

export async function apiRequest(path, options = {}) {
  const token = authStorage.getToken()
  const headers = {
    'Content-Type': 'application/json',
    ...(options.headers || {}),
  }

  if (token) {
    headers.Authorization = `Bearer ${token}`
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...options,
    headers,
  })

  const data = await response.json().catch(() => ({}))

  if (!response.ok || data.success === false) {
    throw new Error(data.message || `${response.status} ${response.statusText || 'Request failed'}: ${path}`)
  }

  return data
}
