export type AuthUser = {
	email: string
	name: string
	picture: string
	uid: string
	id: number
	languages: number[]
}

export type AuthLoginResponse = {
	token: string
	user?: AuthUser
}
