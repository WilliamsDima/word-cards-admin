import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import { useEffect, useState } from "react"
import { onAuthStateChanged } from "firebase/auth"
import { doc, getDoc } from "firebase/firestore"
import LoginPage from "@pages/LoginPage/LoginPage"
import { AppRoutes } from "./routes"
import MainPage from "@pages/MainPage/MainPage"
import NotFoundPage from "@pages/NotFoundPage/NotFoundPage"
import { auth, db } from "@shared/config/firebase"
import UsersPage from "@pages/UsersPage/UsersPage"
import AdminLayout from "@pages/AdminLayout/AdminLayout"
import AplicationPage from "@pages/AplicationPage/AplicationPage"
import ChatsPage from "@pages/ChatsPage/ChatsPage"
import TranslationPage from "@pages/TranslationPage/TranslationPage"
import { useActions } from "@shared/hooks/useActions"
import { useAppSelector } from "@shared/hooks/useStore"
import { useGlobalData } from "@shared/hooks/useGlobalData"

const AppRouter = () => {
	useGlobalData()
	const { setIsAdmin } = useActions()
	const [loading, setLoading] = useState(true)

	const isAdmin = useAppSelector(store => store.app.isAdmin)

	useEffect(() => {
		const unsubscribe = onAuthStateChanged(auth, async user => {
			if (user) {
				const adminDoc = await getDoc(doc(db, "admins", user.uid))
				setIsAdmin(adminDoc.exists())
			} else {
				setIsAdmin(false)
			}
			setLoading(false)
		})
		return () => unsubscribe()
	}, [])

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
						<Route path={AppRoutes.translation} element={<TranslationPage />} />
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
