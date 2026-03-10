import React, { useState } from "react"
import { useGoogleLoginMutation } from "@shared/api/AuthServices"
import { useActions } from "@shared/hooks/useActions"
import { signInWithGoogle } from "@shared/lib/firebaseAuth"

function LoginPage() {
	const { setIsAdmin } = useActions()
	const [googleLogin] = useGoogleLoginMutation()
	const [googleLoading, setGoogleLoading] = useState(false)
	const [googleError, setGoogleError] = useState<string | null>(null)

	const onGoogleLogin = async () => {
		setGoogleLoading(true)
		setGoogleError(null)
		try {
			const { idToken } = await signInWithGoogle()
			const me = await googleLogin({ idToken }).unwrap()
			console.log("me", me)

			setIsAdmin(Boolean(me.isAdmin ?? me.user?.isAdmin ?? true))
		} catch (err) {
			setGoogleError(err instanceof Error ? err.message : "Google login error")
		} finally {
			setGoogleLoading(false)
		}
	}

	return (
		<form>
			<h2>Login</h2>
			<button type='button' onClick={onGoogleLogin} disabled={googleLoading}>
				{googleLoading ? "Loading..." : "Sign in with Google"}
			</button>
			{googleError ? <p>{googleError}</p> : null}
		</form>
	)
}

export default LoginPage
