import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { userNotificationSettingsService } from "./UserNotificationSettingsService"
import type {
	SendUserPushNotificationPayload,
	SendUserPushNotificationResponse,
	UpdateUserNotificationSettingsPayload,
	UserNotificationSettings,
} from "./types"

export const userNotificationSettingsAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getUserNotificationSettings: builder.query<
			UserNotificationSettings,
			number | string
		>({
			async queryFn(userId) {
				return toRtkQueryResult(
					await userNotificationSettingsService.getUserNotificationSettings(
						userId,
					),
				)
			},
			providesTags: (_result, _error, userId) => [
				{ type: "userNotificationSettings", id: String(userId) },
			],
		}),
		updateUserNotificationSettings: builder.mutation<
			UserNotificationSettings,
			UpdateUserNotificationSettingsPayload
		>({
			async queryFn(payload) {
				return toRtkQueryResult(
					await userNotificationSettingsService.updateUserNotificationSettings(
						payload,
					),
				)
			},
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userNotificationSettings", id: String(payload.userId) },
			],
		}),
		sendUserPushNotification: builder.mutation<
			SendUserPushNotificationResponse,
			SendUserPushNotificationPayload
		>({
			async queryFn(payload) {
				return toRtkQueryResult(
					await userNotificationSettingsService.sendUserPushNotification(
						payload,
					),
				)
			},
			// devices_count мог уменьшиться: сервер удаляет невалидные токены
			// и при успехе, и при 409 «no valid registered devices»
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userNotificationSettings", id: String(payload.userId) },
			],
		}),
	}),
})

export const {
	useGetUserNotificationSettingsQuery,
	useUpdateUserNotificationSettingsMutation,
	useSendUserPushNotificationMutation,
} = userNotificationSettingsAPI
