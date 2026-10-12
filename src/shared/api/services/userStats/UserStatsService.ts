import { request } from "@shared/api/request"
import {
	USER_STATS_ALL_TIME,
	type GetUserYearStatsParams,
	type UserYearStats,
} from "./types"

const buildUserStatsQuery = (params: GetUserYearStatsParams) => {
	const query = new URLSearchParams()
	if (typeof params.year === "number" || params.year === USER_STATS_ALL_TIME) {
		query.set("year", String(params.year))
	}

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
