import React, { useState } from "react"
import { useGoogleLoginMutation } from "@shared/api/services/auth/AuthServices"
import { useActions } from "@shared/hooks/useActions"
import { signInWithGoogle } from "@shared/config/firebaseAuth"
import Button from "@shared/Button/Button"
import { Icon } from "@assets/icons/Icon"

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
		<div>
			<h2>Login</h2>
			<Button>
				<Icon name='google' width={64} height={64} />
			</Button>
			<button type='button' onClick={onGoogleLogin} disabled={googleLoading}>
				{googleLoading ? "Loading..." : "Sign in with Google"}
			</button>
			{googleError ? <p>{googleError}</p> : null}
		</div>
	)
}

export default LoginPage
