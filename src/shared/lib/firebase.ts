import { getApp, getApps, initializeApp } from "firebase/app"

const requiredEnv = [
	["VITE_FIREBASE_API_KEY", import.meta.env.VITE_FIREBASE_API_KEY],
	["VITE_FIREBASE_AUTH_DOMAIN", import.meta.env.VITE_FIREBASE_AUTH_DOMAIN],
	["VITE_FIREBASE_PROJECT_ID", import.meta.env.VITE_FIREBASE_PROJECT_ID],
	["VITE_FIREBASE_APP_ID", import.meta.env.VITE_FIREBASE_APP_ID],
] as const

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
}

export const getFirebaseMissingEnv = () =>
	requiredEnv.filter(([, value]) => !value).map(([key]) => key)

export const getFirebaseApp = () => {
	const missing = getFirebaseMissingEnv()
	if (missing.length > 0) return null
	return getApps().length > 0 ? getApp() : initializeApp(firebaseConfig)
}
