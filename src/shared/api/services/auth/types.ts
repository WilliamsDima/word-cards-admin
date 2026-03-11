export type AuthUser = {
	id?: string
	email?: string
	name?: string
	isAdmin?: boolean
}

export type AuthLoginResponse = {
	token: string
	user?: AuthUser
}

export type AuthMeResponse = {
	user?: AuthUser
	isAdmin?: boolean
}
