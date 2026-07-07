import { request } from "@shared/api/request"
import type {
	GetUserAchievementsResponse,
	ResetUserAchievementPayload,
	ResetUserAchievementResponse,
} from "./types"

class UserAchievementsService {
	getUserAchievements(userId: number | string) {
		return request<GetUserAchievementsResponse>(
			`/admin/users/${userId}/achievements`,
			{ method: "GET" },
		)
	}

	resetUserAchievement(payload: ResetUserAchievementPayload) {
		const { userId, achievementId } = payload
		return request<ResetUserAchievementResponse>(
			`/admin/users/${userId}/achievements/${achievementId}`,
			{ method: "DELETE" },
		)
	}
}

export const userAchievementsService = new UserAchievementsService()
