import { baseRTK } from "@app/api/BaseRTK"
import type { ISocial } from "@shared/api/types"

const notImplemented = {
	status: 501,
	data: "Not implemented: backend endpoints are not wired yet",
}

export const appAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		// изменение названия приложения
		changeAppName: builder.mutation<void, { appName: string }>({
			async queryFn() {
				return { error: notImplemented }
			},
		}),
		// изменение ссылки политики конфиденциальности
		changePrivacyPolicyLink: builder.mutation<void, { privacy_policy_link: string }>({
			async queryFn() {
				return { error: notImplemented }
			},
		}),
		// изменение Google Play
		changeGooglePlay: builder.mutation<void, { icon: string; link: string }>({
			async queryFn() {
				return { error: notImplemented }
			},
		}),
		// изменение версии приложения
		changeAppVersion: builder.mutation<void, { version: string }>({
			async queryFn() {
				return { error: notImplemented }
			},
		}),
		// показ авторизации VK
		changeShowVkAuth: builder.mutation<void, { showVKAuth: boolean }>({
			async queryFn() {
				return { error: notImplemented }
			},
		}),
		// изменение соц сетей
		changeSocials: builder.mutation<void, { socials: ISocial[] }>({
			async queryFn() {
				return { error: notImplemented }
			},
		}),
	}),
})

export const {
	useChangeAppNameMutation,
	useChangeShowVkAuthMutation,
	useChangePrivacyPolicyLinkMutation,
	useChangeAppVersionMutation,
	useChangeGooglePlayMutation,
	useChangeSocialsMutation,
} = appAPI
