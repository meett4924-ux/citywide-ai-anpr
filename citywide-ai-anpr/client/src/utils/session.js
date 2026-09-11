const TOKEN_KEY = 'anpr_token'
const USER_KEY = 'anpr_user'

// When "remember me" is checked the session survives browser restarts (localStorage).
// Otherwise it only lasts for the current tab/browser session (sessionStorage).
export function saveSession({ token, user, rememberMe }) {
  const store = rememberMe ? localStorage : sessionStorage
  const other = rememberMe ? sessionStorage : localStorage
  store.setItem(TOKEN_KEY, token)
  store.setItem(USER_KEY, JSON.stringify(user))
  // Make sure a session isn't accidentally duplicated across both storages.
  other.removeItem(TOKEN_KEY)
  other.removeItem(USER_KEY)
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY) || sessionStorage.getItem(TOKEN_KEY)
}

export function getStoredUser() {
  const raw = localStorage.getItem(USER_KEY) || sessionStorage.getItem(USER_KEY)
  return raw ? JSON.parse(raw) : null
}

export function clearSession() {
  localStorage.removeItem(TOKEN_KEY)
  localStorage.removeItem(USER_KEY)
  sessionStorage.removeItem(TOKEN_KEY)
  sessionStorage.removeItem(USER_KEY)
}
