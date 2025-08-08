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

const AppRouter = () => {
	const [loading, setLoading] = useState(true)
	const [isAdmin, setIsAdmin] = useState(false)

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
