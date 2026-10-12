import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { userStreakService } from "./UserStreakService"
import type { UpdateUserStreakPayload, UserStreak } from "./types"

export const userStreakAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getUserStreak: builder.query<UserStreak, number | string>({
			async queryFn(userId) {
				return toRtkQueryResult(await userStreakService.getUserStreak(userId))
			},
			providesTags: (_result, _error, userId) => [
				{ type: "userStreak", id: String(userId) },
			],
		}),
		updateUserStreak: builder.mutation<UserStreak, UpdateUserStreakPayload>({
			async queryFn(payload) {
				return toRtkQueryResult(await userStreakService.updateUserStreak(payload))
			},
			// longest_streak попадает в статистику, а его повышение может
			// разблокировать достижения STREAK_LONGEST
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userStreak", id: String(payload.userId) },
				{ type: "userStats", id: String(payload.userId) },
				{ type: "userAchievements", id: payload.userId },
			],
		}),
	}),
})

export const { useGetUserStreakQuery, useUpdateUserStreakMutation } =
	userStreakAPI
