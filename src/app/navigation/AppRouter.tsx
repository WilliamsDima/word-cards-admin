import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import LoginPage from "@pages/LoginPage/LoginPage"
import { AppRoutes } from "./routes"
import MainPage from "@pages/MainPage/MainPage"
import NotFoundPage from "@pages/NotFoundPage/NotFoundPage"
import UsersPage from "@pages/UsersPage/UsersPage"
import AdminLayout from "@pages/AdminLayout/AdminLayout"
import AplicationPage from "@pages/AplicationPage/AplicationPage"
import ChatsPage from "@pages/ChatsPage/ChatsPage"
// import TranslationPage from "@pages/TranslationPage/TranslationPage"
import { useActions } from "@shared/hooks/useActions"
import { useAppSelector } from "@shared/hooks/useStore"
import { useMeQuery } from "@shared/api/auth/AuthServices"
import { getAuthToken } from "@shared/lib/authToken"
import SocialsPage from "@pages/SocialsPage/SocialsPage"

const AppRouter = () => {
	const { setIsAdmin } = useActions()
	const [loading, setLoading] = useState(true)

	const isAdmin = useAppSelector(store => store.app.isAdmin)
	const token = getAuthToken()
	const { data, isLoading, isError } = useMeQuery(undefined, {
		skip: !token,
	})

	useEffect(() => {
		if (!token) {
			setIsAdmin(false)
			setLoading(false)
			return
		}

		if (isLoading) return

		if (isError) {
			setIsAdmin(false)
			setLoading(false)
			return
		}

		const adminFlag = data?.isAdmin ?? data?.user?.isAdmin

		setIsAdmin(Boolean(adminFlag ?? data))
		setLoading(false)
	}, [token, isLoading, isError, data, setIsAdmin])

	if (loading) return <p>Загрузка...</p>

	return (
		<BrowserRouter>
			<Routes>
				<Route
					path={AppRoutes.login}
					element={
						isAdmin ? <Navigate to={AppRoutes.main} replace /> : <LoginPage />
					}
				/>

				{isAdmin ? (
					<Route path={AppRoutes.main} element={<AdminLayout />}>
						<Route index element={<MainPage />} />
						<Route path={AppRoutes.users} element={<UsersPage />} />
						<Route path={AppRoutes.aplication} element={<AplicationPage />} />
						{/* <Route path={AppRoutes.translation} element={<TranslationPage />} /> */}
						<Route path={AppRoutes.socials} element={<SocialsPage />} />
						<Route path={AppRoutes.chats} element={<ChatsPage />} />

						<Route path={AppRoutes.notFount} element={<NotFoundPage />} />
					</Route>
				) : (
					<Route
						path={AppRoutes.notFount}
						element={<Navigate to={AppRoutes.login} replace />}
					/>
				)}
			</Routes>
		</BrowserRouter>
	)
}

export default AppRouter
