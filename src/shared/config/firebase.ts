import { initializeApp } from "firebase/app"
import {
	getAuth,
	GoogleAuthProvider,
	signInWithPopup,
	signOut,
} from "firebase/auth"
import { doc, getDoc, getFirestore } from "firebase/firestore"

const firebaseConfig = {
	apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
	authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
	projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
	storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
	messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
	appId: import.meta.env.VITE_FIREBASE_APP_ID,
}

const app = initializeApp(firebaseConfig)

export const auth = getAuth(app)
export const db = getFirestore(app)

export const loginAndCheckAdmin = async () => {
	const provider = new GoogleAuthProvider()
	const result = await signInWithPopup(auth, provider)
	const user = result.user

	const adminDoc = await getDoc(doc(db, "admins", user.uid))

	if (!adminDoc.exists()) {
		auth.signOut()
	}
}

export const logout = async () => {
	await signOut(auth)
}
