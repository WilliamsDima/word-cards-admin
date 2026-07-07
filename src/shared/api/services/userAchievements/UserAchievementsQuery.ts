import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { userAchievementsService } from "./UserAchievementsService"
import type {
	GetUserAchievementsResponse,
	ResetUserAchievementPayload,
	ResetUserAchievementResponse,
} from "./types"

export const userAchievementsAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getUserAchievements: builder.query<
			GetUserAchievementsResponse,
			number | string
		>({
			async queryFn(userId) {
				return toRtkQueryResult(
					await userAchievementsService.getUserAchievements(userId),
				)
			},
			providesTags: (_result, _error, userId) => [
				{ type: "userAchievements", id: userId },
			],
		}),
		resetUserAchievement: builder.mutation<
			ResetUserAchievementResponse,
			ResetUserAchievementPayload
		>({
			async queryFn(payload) {
				return toRtkQueryResult(
					await userAchievementsService.resetUserAchievement(payload),
				)
			},
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userAchievements", id: payload.userId },
			],
		}),
	}),
})

export const { useGetUserAchievementsQuery, useResetUserAchievementMutation } =
	userAchievementsAPI
