import { request } from "@shared/api/request"
import type {
	Achievement,
	AchievementPayload,
	DeleteAchievementResponse,
	GetAchievementsResponse,
} from "./types"

class AchievementsService {
	getAchievements() {
		return request<GetAchievementsResponse>("/admin/achievements", {
			method: "GET",
		})
	}

	getAchievement(id: number) {
		return request<Achievement>(`/admin/achievements/${id}`, {
			method: "GET",
		})
	}

	createAchievement(payload: AchievementPayload) {
		return request<Achievement>("/admin/achievements", {
			method: "POST",
			json: payload,
		})
	}

	updateAchievement(id: number, payload: AchievementPayload) {
		return request<Achievement>(`/admin/achievements/${id}`, {
			method: "PUT",
			json: payload,
		})
	}

	deleteAchievement(id: number) {
		return request<DeleteAchievementResponse>(`/admin/achievements/${id}`, {
			method: "DELETE",
		})
	}
}

export const achievementsService = new AchievementsService()
