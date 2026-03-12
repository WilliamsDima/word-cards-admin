export type AuthUser = {
	email: string
	name: string
	picture: string
	uid: string
	id: number
}

export type AuthLoginResponse = {
	token: string
	user?: AuthUser
}
