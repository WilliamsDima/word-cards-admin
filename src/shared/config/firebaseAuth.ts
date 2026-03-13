import {
	getAuth,
	GoogleAuthProvider,
	onIdTokenChanged,
	signInWithPopup,
} from "firebase/auth"
import { getFirebaseApp, getFirebaseMissingEnv } from "./firebase"
import { setAuthToken } from "../lib/authToken"
import { authService } from "@shared/api/services/auth/AuthService"

const tokenState = {
	listenerReady: false,
	lastSyncedToken: null as string | null,
}

const syncUserWithBackend = async (idToken: string) => {
	const result = await authService.googleSync(idToken)
	if (!result.ok) {
		throw new Error(
			`users/sync failed: ${result.error.status} ${result.error.message}`,
		)
	}
	return result.data
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
	if (tokenState.listenerReady) return false
	const app = getFirebaseApp()
	if (!app) return false

	const auth = getAuth(app)
	tokenState.listenerReady = true

	onIdTokenChanged(auth, async user => {
		if (!user) {
			setAuthToken(null)
			tokenState.lastSyncedToken = null
			return
		}
		try {
			const token = await user.getIdToken()
			setAuthToken(token)
			if (token !== tokenState.lastSyncedToken) {
				await syncUserWithBackend(token)
				tokenState.lastSyncedToken = token
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
