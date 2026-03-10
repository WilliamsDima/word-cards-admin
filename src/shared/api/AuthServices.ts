import { baseRTK } from "@app/api/BaseRTK"
import { clearAuthToken, setAuthToken } from "@shared/lib/authToken"

export type AuthUser = {
	id?: string
	email?: string
	name?: string
	isAdmin?: boolean
}

export type AuthLoginRequest = {
	login: string
	password: string
}

export type AuthLoginResponse = {
	token: string
	user?: AuthUser
}

export type AuthMeResponse = {
	user?: AuthUser
	isAdmin?: boolean
}

export const authAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<AuthLoginResponse, AuthLoginRequest>({
			query: body => ({
				url: "/auth/login",
				method: "POST",
				body,
			}),
			async onQueryStarted(_arg, { queryFulfilled }) {
				try {
					const { data } = await queryFulfilled
					if (data?.token) setAuthToken(data.token)
				} catch {
					// ignore
				}
			},
		}),
		me: builder.query<AuthMeResponse, void>({
			query: () => ({
				url: "/auth/me",
				method: "GET",
			}),
		}),
		googleLogin: builder.mutation<AuthMeResponse, { idToken: string }>({
			query: ({ idToken }) => ({
				url: "/users/sync",
				method: "POST",
				headers: {
					Authorization: `Bearer ${idToken}`,
				},
			}),
			async onQueryStarted({ idToken }, { queryFulfilled }) {
				try {
					await queryFulfilled
					setAuthToken(idToken)
				} catch {
					// ignore
				}
			},
		}),
		logout: builder.mutation<void, void>({
			query: () => ({
				url: "/auth/logout",
				method: "POST",
			}),
			async onQueryStarted(_arg, { queryFulfilled }) {
				try {
					await queryFulfilled
				} finally {
					clearAuthToken()
				}
			},
		}),
	}),
})

export const {
	useLoginMutation,
	useMeQuery,
	useLazyMeQuery,
	useGoogleLoginMutation,
	useLogoutMutation,
} = authAPI
