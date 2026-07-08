import { GoogleAuthProvider, onIdTokenChanged, signInWithPopup } from "firebase/auth"
import { getFirebaseApp } from "./firebase"
import { getAuthClient } from "./authClient"
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

export const initFirebaseAuthTokenSync = () => {
	if (tokenState.listenerReady) return false
	const app = getFirebaseApp()
	if (!app) return false

	const auth = getAuthClient()
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

	// Firebase's own proactive refresh timer is scheduled with setTimeout and
	// gets paused while the tab is backgrounded or the machine sleeps, which
	// is how a session ends up with a stale/expired ID token mid-use. Asking
	// for the token again on tab focus lets the SDK notice the token expired
	// and mint a new one (firing onIdTokenChanged above) before the user
	// issues the next API request.
	if (typeof document !== "undefined") {
		document.addEventListener("visibilitychange", () => {
			if (document.visibilityState !== "visible") return
			const user = auth.currentUser
			if (!user) return
			user.getIdToken().catch(() => {
				// handled by the reactive 401 refresh in the API layer
			})
		})
	}

	return true
}

export const signInWithGoogle = async () => {
	const auth = getAuthClient()
	const provider = new GoogleAuthProvider()
	const result = await signInWithPopup(auth, provider)
	const token = await result.user.getIdToken()
	return { user: result.user, idToken: token }
}
