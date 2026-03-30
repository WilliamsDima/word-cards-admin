import { request } from "@shared/api/request"
import type { GetUserYearStatsParams, UserYearStats } from "./types"

const buildUserStatsQuery = (params: GetUserYearStatsParams) => {
	const query = new URLSearchParams()
	if (typeof params.year === "number") query.set("year", String(params.year))

	const queryString = query.toString()
	return queryString ? `?${queryString}` : ""
}

class UserStatsService {
	getUserYearStats(params: GetUserYearStatsParams) {
		const query = buildUserStatsQuery(params)
		return request<UserYearStats>(
			`/admin/users/${params.userId}/stats${query}`,
			{ method: "GET" },
		)
	}
}

export const userStatsService = new UserStatsService()
