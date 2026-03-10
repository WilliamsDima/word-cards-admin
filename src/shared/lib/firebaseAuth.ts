import { getAuth, GoogleAuthProvider, onIdTokenChanged, signInWithPopup } from "firebase/auth"
import { getFirebaseApp, getFirebaseMissingEnv } from "./firebase"
import { setAuthToken } from "./authToken"

let tokenListenerReady = false
let lastSyncedToken: string | null = null

const getApiBaseUrl = () =>
	import.meta.env.VITE_API_BASE_URL ?? "http://192.168.31.205:8080"

const syncUserWithBackend = async (idToken: string) => {
	const res = await fetch(`${getApiBaseUrl()}/users/sync`, {
		method: "POST",
		headers: {
			Authorization: `Bearer ${idToken}`,
		},
	})
	if (!res.ok) {
		throw new Error(`users/sync failed: ${res.status}`)
	}
	return res.json()
}

const getAuthClient = () => {
	const app = getFirebaseApp()
	if (!app) {
		const missing = getFirebaseMissingEnv()
		throw new Error(`Firebase env is missing: ${missing.join(", ")}`)
	}
	return getAuth(app)
}

export const initFirebaseAuthTokenSync = () => {
	if (tokenListenerReady) return false
	const app = getFirebaseApp()
	if (!app) return false

	const auth = getAuth(app)
	tokenListenerReady = true

	onIdTokenChanged(auth, async user => {
		if (!user) {
			setAuthToken(null)
			lastSyncedToken = null
			return
		}
		try {
			const token = await user.getIdToken()
			setAuthToken(token)
			if (token !== lastSyncedToken) {
				await syncUserWithBackend(token)
				lastSyncedToken = token
			}
		} catch {
			// keep the last known token
		}
	})

	return true
}

export const signInWithGoogle = async () => {
	const auth = getAuthClient()
	const provider = new GoogleAuthProvider()
	const result = await signInWithPopup(auth, provider)
	const token = await result.user.getIdToken()
	return { user: result.user, idToken: token }
}
