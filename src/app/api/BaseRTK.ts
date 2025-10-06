import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react"

export const baseRTK = createApi({
	reducerPath: "baseRTK",
	baseQuery: fetchBaseQuery(),
	tagTypes: ["users"],
	endpoints: () => ({}),
})
