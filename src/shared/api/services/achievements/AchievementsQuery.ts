import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { achievementsService } from "./AchievementsService"
import type {
	Achievement,
	AchievementPayload,
	DeleteAchievementResponse,
	GetAchievementsResponse,
} from "./types"

export const achievementsAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getAchievements: builder.query<GetAchievementsResponse, void>({
			async queryFn() {
				return toRtkQueryResult(await achievementsService.getAchievements())
			},
			providesTags: ["achievements"],
		}),
		getAchievement: builder.query<Achievement, number>({
			async queryFn(id) {
				return toRtkQueryResult(await achievementsService.getAchievement(id))
			},
			providesTags: (_result, _error, id) => [{ type: "achievements", id }],
		}),
		createAchievement: builder.mutation<Achievement, AchievementPayload>({
			async queryFn(payload) {
				return toRtkQueryResult(
					await achievementsService.createAchievement(payload),
				)
			},
			invalidatesTags: ["achievements"],
		}),
		updateAchievement: builder.mutation<
			Achievement,
			{ id: number; payload: AchievementPayload }
		>({
			async queryFn({ id, payload }) {
				return toRtkQueryResult(
					await achievementsService.updateAchievement(id, payload),
				)
			},
			invalidatesTags: ["achievements"],
		}),
		deleteAchievement: builder.mutation<DeleteAchievementResponse, number>({
			async queryFn(id) {
				return toRtkQueryResult(
					await achievementsService.deleteAchievement(id),
				)
			},
			invalidatesTags: ["achievements"],
		}),
	}),
})

export const {
	useGetAchievementsQuery,
	useGetAchievementQuery,
	useCreateAchievementMutation,
	useUpdateAchievementMutation,
	useDeleteAchievementMutation,
} = achievementsAPI
