import { request } from "@shared/api/request"
import type {
	UpdateUserNotificationSettingsPayload,
	UserNotificationSettings,
} from "./types"

class UserNotificationSettingsService {
	getUserNotificationSettings(userId: number | string) {
		return request<UserNotificationSettings>(
			`/admin/users/${userId}/notification-settings`,
			{
				method: "GET",
			},
		)
	}

	updateUserNotificationSettings(
		payload: UpdateUserNotificationSettingsPayload,
	) {
		const { userId, ...body } = payload
		return request<UserNotificationSettings>(
			`/admin/users/${userId}/notification-settings`,
			{
				method: "PUT",
				json: body,
			},
		)
	}
}

export const userNotificationSettingsService =
	new UserNotificationSettingsService()
