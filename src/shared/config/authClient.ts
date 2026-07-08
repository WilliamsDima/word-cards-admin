import { getAuth } from "firebase/auth"
import { getFirebaseApp, getFirebaseMissingEnv } from "./firebase"
import { setAuthToken } from "../lib/authToken"

export const getAuthClient = () => {
	const app = getFirebaseApp()
	if (!app) {
		const missing = getFirebaseMissingEnv()
		throw new Error(`Firebase env is missing: ${missing.join(", ")}`)
	}
	return getAuth(app)
}

/**
 * Forces Firebase to mint a brand new ID token for the current user and
 * stores it via `authToken`. Used as the reactive fallback when the API
 * rejects a request with 401 because the cached token has expired.
 * Returns `null` if there is no signed-in user or the refresh fails.
 */
export const refreshAuthToken = async (): Promise<string | null> => {
	try {
		const auth = getAuthClient()
		const user = auth.currentUser
		if (!user) return null

		const token = await user.getIdToken(true)
		setAuthToken(token)
		return token
	} catch {
		return null
	}
}
