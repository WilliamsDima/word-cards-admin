import { baseRTK } from "@app/api/BaseRTK"
import { clearAuthToken, setAuthToken } from "@shared/lib/authToken"
import { authService } from "@shared/api/auth/service"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import type {
	AuthLoginRequest,
	AuthLoginResponse,
	AuthMeResponse,
} from "@shared/api/auth/types"

export const authAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		login: builder.mutation<AuthLoginResponse, AuthLoginRequest>({
			async queryFn(body) {
				return toRtkQueryResult(await authService.login(body))
			},
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
			async queryFn() {
				return toRtkQueryResult(await authService.me())
			},
		}),
		googleLogin: builder.mutation<AuthMeResponse, { idToken: string }>({
			async queryFn({ idToken }) {
				return toRtkQueryResult(await authService.googleSync(idToken))
			},
			async onQueryStarted({ idToken }, { queryFulfilled }) {
				try {
					await queryFulfilled
					setAuthToken(idToken)
				} catch {
					// ignore
				}
			},
		}),
		// TODO: mock
		logout: builder.mutation<void, void>({
			async queryFn() {
				return toRtkQueryResult(await authService.logout())
			},
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
