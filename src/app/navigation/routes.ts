export const AppRoutes = {
	main: "/",
	login: "/login",
	notFount: "*",
	users: "/users",
	userProfile: "/user/:id",
	aplication: "/aplication",
	translation: `/aplication/translation`,
	chats: "/chats",
} as const

export type AppRouteKey = keyof typeof AppRoutes
export type AppRoutePath = (typeof AppRoutes)[AppRouteKey]

export interface RouteParams {
	[AppRoutes.main]: undefined
	[AppRoutes.login]: undefined
	[AppRoutes.users]: undefined
	[AppRoutes.userProfile]: { id: string }
	[AppRoutes.aplication]: undefined
	[AppRoutes.notFount]: undefined
	[AppRoutes.chats]: undefined
	[AppRoutes.translation]: undefined
}
