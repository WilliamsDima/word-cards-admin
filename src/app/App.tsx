import React from "react"
import AppRouter from "./navigation/AppRouter"
import { ToastProvider } from "@shared/Toast/ToastProvider"

function App() {
	return (
		<ToastProvider>
			<AppRouter />
		</ToastProvider>
	)
}

export default App
