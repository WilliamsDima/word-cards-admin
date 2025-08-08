import { Navigate, Outlet } from "react-router-dom"
import { AppRoutes } from "./routes"

type ProtectedRouteProps = {
	isAllowed: boolean
	redirectPath?: string
}

export function ProtectedRoute({
	isAllowed,
	redirectPath = AppRoutes.login,
}: ProtectedRouteProps) {
	if (!isAllowed) {
		return <Navigate to={redirectPath} replace />
	}
	return <Outlet />
}
