import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { userStatsService } from "./UserStatsService"
import type { GetUserYearStatsParams, UserYearStats } from "./types"

export const userStatsAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getUserYearStats: builder.query<UserYearStats, GetUserYearStatsParams>({
			async queryFn(params) {
				return toRtkQueryResult(await userStatsService.getUserYearStats(params))
			},
			providesTags: (_result, _error, params) => [
				{ type: "userStats", id: `${params.userId}-${params.year ?? "current"}` },
				// общий тег пользователя: инвалидируется при правке стрика
				{ type: "userStats", id: String(params.userId) },
			],
		}),
	}),
})

export const { useGetUserYearStatsQuery } = userStatsAPI
