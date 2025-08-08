import { loginAndCheckAdmin } from "@shared/config/firebase"
import React from "react"

function LoginPage() {
	return <div onClick={loginAndCheckAdmin}>LoginPage</div>
}

export default LoginPage
