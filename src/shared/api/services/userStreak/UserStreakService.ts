import { request } from "@shared/api/request"
import type { UpdateUserStreakPayload, UserStreak } from "./types"

class UserStreakService {
	getUserStreak(userId: number | string) {
		return request<UserStreak>(`/admin/users/${userId}/streak`, {
			method: "GET",
		})
	}

	updateUserStreak(payload: UpdateUserStreakPayload) {
		const { userId, ...body } = payload
		return request<UserStreak>(`/admin/users/${userId}/streak`, {
			method: "PUT",
			json: body,
		})
	}
}

export const userStreakService = new UserStreakService()
