import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import type {
	BaseQueryFn,
	FetchArgs,
	FetchBaseQueryError,
} from "@reduxjs/toolkit/query/react"
import { getAuthToken } from "@shared/lib/authToken"
import { refreshAuthToken } from "@shared/config/authClient"

const rawBaseQuery = fetchBaseQuery({
	baseUrl: import.meta.env.VITE_API_BASE_URL,
	prepareHeaders: headers => {
		const token = getAuthToken()
		if (token) headers.set("Authorization", `Bearer ${token}`)
		return headers
	},
})

// The cached Firebase ID token can expire mid-session (the SDK's own
// proactive refresh timer pauses while the tab is backgrounded/asleep). On a
// 401 we force a fresh token once and retry the same request instead of
// leaving every endpoint broken until the user manually reloads.
const baseQueryWithReauth: BaseQueryFn<
	string | FetchArgs,
	unknown,
	FetchBaseQueryError
> = async (args, api, extraOptions) => {
	const result = await rawBaseQuery(args, api, extraOptions)
	if (result.error?.status !== 401) return result

	const freshToken = await refreshAuthToken()
	if (!freshToken) return result

	return rawBaseQuery(args, api, extraOptions)
}

export const baseRTK = createApi({
	reducerPath: "baseRTK",
	baseQuery: baseQueryWithReauth,
	tagTypes: [
		"users",
		"app",
		"translations",
		"auth",
		"languages",
		"userCards",
		"userStats",
		"achievements",
		"userAchievements",
	],
	endpoints: () => ({}),
})
