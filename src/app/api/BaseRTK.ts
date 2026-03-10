import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"
import { getAuthToken } from "@shared/lib/authToken"

export const baseRTK = createApi({
	reducerPath: "baseRTK",
	baseQuery: fetchBaseQuery({
		baseUrl: import.meta.env.VITE_API_BASE_URL ?? "http://192.168.31.205:8080",
		prepareHeaders: headers => {
			const token = getAuthToken()
			if (token) headers.set("Authorization", `Bearer ${token}`)
			return headers
		},
	}),
	tagTypes: ["users", "app", "translations", "auth"],
	endpoints: () => ({}),
})
