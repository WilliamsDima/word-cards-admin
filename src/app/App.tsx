import AppRouter from "./navigation/AppRouter"
import PublicRouter from "./navigation/PublicRouter"
import { isPublicPath } from "./navigation/routes"
import { ToastProvider } from "@shared/Toast/ToastProvider"

// Решается один раз при загрузке страницы: публичные страницы (например,
// /download) открываются полной загрузкой и не должны проходить через
// auth-гейт AppRouter (восстановление сессии, /auth/me, редирект на логин).
const IS_PUBLIC_ENTRY = isPublicPath(window.location.pathname)

function App() {
	return (
		<ToastProvider>
			{IS_PUBLIC_ENTRY ? <PublicRouter /> : <AppRouter />}
		</ToastProvider>
	)
}

export default App
