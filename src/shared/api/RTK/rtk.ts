import type { FetchBaseQueryError } from "@reduxjs/toolkit/query"
import type { ServiceResult } from "../result"

export const toRtkQueryResult = <T>(result: ServiceResult<T>) => {
	if (result.ok) return { data: result.data }

	const status =
		typeof result.error.status === "number"
			? result.error.status
			: "CUSTOM_ERROR"

	return {
		error: {
			status,
			data: result.error,
		} as FetchBaseQueryError,
	}
}
