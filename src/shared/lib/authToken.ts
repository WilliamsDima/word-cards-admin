const STORAGE_KEY = "auth_token"

let memoryToken: string | null = null

export const getAuthToken = (): string | null => {
	if (memoryToken) return memoryToken
	if (typeof window === "undefined") return null

	try {
		const token = window.localStorage.getItem(STORAGE_KEY)
		if (token) memoryToken = token
		return token
	} catch {
		return memoryToken
	}
}

export const setAuthToken = (token: string | null) => {
	memoryToken = token
	if (typeof window === "undefined") return

	try {
		if (token) window.localStorage.setItem(STORAGE_KEY, token)
		else window.localStorage.removeItem(STORAGE_KEY)
	} catch {
		// ignore storage errors (private mode, blocked, etc.)
	}
}

export const clearAuthToken = () => setAuthToken(null)
