import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom"
import DownloadPage from "@pages/DownloadPage/DownloadPage"
import { AppRoutes } from "./routes"

/**
 * Роутер публичной части (см. `isPublicPath`). Рендерится вместо `AppRouter`,
 * поэтому не восстанавливает Firebase-сессию, не вызывает `/auth/me` и
 * не редиректит на логин.
 */
const PublicRouter = () => {
	return (
		<BrowserRouter>
			<Routes>
				<Route path={AppRoutes.download} element={<DownloadPage />} />
				<Route
					path={AppRoutes.notFount}
					element={<Navigate to={AppRoutes.download} replace />}
				/>
			</Routes>
		</BrowserRouter>
	)
}

export default PublicRouter
