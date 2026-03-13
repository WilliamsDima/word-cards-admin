const STORAGE_KEY = "auth_token"
const tokenStore: { value: string | null } = { value: null }

export const getAuthToken = (): string | null => {
	if (tokenStore.value) return tokenStore.value
	if (typeof window === "undefined") return null

	try {
		const token = window.localStorage.getItem(STORAGE_KEY)
		if (token) tokenStore.value = token
		return token
	} catch {
		return tokenStore.value
	}
}

export const setAuthToken = (token: string | null) => {
	tokenStore.value = token
	if (typeof window === "undefined") return

	try {
		if (token) window.localStorage.setItem(STORAGE_KEY, token)
		else window.localStorage.removeItem(STORAGE_KEY)
	} catch {
		// ignore storage errors (private mode, blocked, etc.)
	}
}

export const clearAuthToken = () => setAuthToken(null)
