export const AppRoutes = {
	main: "/",
	login: "/login",
	notFount: "*",
	users: "/users",
	userProfile: "/user/:id",
	aplication: "/aplication",
	translation: "/translation",
	socials: `/socials`,
	chats: "/chats",
	achievements: "/achievements",
	download: "/download",
} as const

/**
 * Публичные маршруты: открываются без Firebase-входа и без админских прав.
 * Для них не восстанавливается Firebase-сессия и не дергается защищённый API.
 */
const PUBLIC_PATHS: readonly string[] = [AppRoutes.download]

export const isPublicPath = (pathname: string): boolean => {
	const normalized =
		pathname.length > 1 ? pathname.replace(/\/+$/, "") : pathname
	return PUBLIC_PATHS.includes(normalized)
}

export type AppRouteKey = keyof typeof AppRoutes
export type AppRoutePath = (typeof AppRoutes)[AppRouteKey]

export interface RouteParams {
	[AppRoutes.main]: undefined
	[AppRoutes.login]: undefined
	[AppRoutes.users]: undefined
	[AppRoutes.userProfile]: { id: number }
	[AppRoutes.aplication]: undefined
	[AppRoutes.notFount]: undefined
	[AppRoutes.chats]: undefined
	[AppRoutes.translation]: undefined
	[AppRoutes.socials]: undefined
	[AppRoutes.achievements]: undefined
	[AppRoutes.download]: undefined
}
