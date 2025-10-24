import { doc, updateDoc } from "firebase/firestore"
import { baseRTK } from "@app/api/BaseRTK"
import { db } from "@shared/config/firebase"
import type { ISocial } from "@shared/api/types"

export const appAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		// изменение названия приложения
		changeAppName: builder.mutation<void, { appName: string }>({
			async queryFn({ appName }) {
				const appRef = doc(db, "app", "info")

				await updateDoc(appRef, {
					appName,
				})

				return { data: undefined }
			},
			invalidatesTags: ["firebaseApp"],
		}),
		// изменение ссылки Политика конфиденциальности
		changePrivacyPolicyLink: builder.mutation<
			void,
			{ privacy_policy_link: string }
		>({
			async queryFn({ privacy_policy_link }) {
				const appRef = doc(db, "app", "info")

				await updateDoc(appRef, {
					privacy_policy_link,
				})

				return { data: undefined }
			},
			invalidatesTags: ["firebaseApp"],
		}),
		// изменение гугл плей
		changeGooglePlay: builder.mutation<void, { icon: string; link: string }>({
			async queryFn({ icon, link }) {
				const appRef = doc(db, "app", "info")

				await updateDoc(appRef, {
					developer: {
						icon,
						link,
					},
				})

				return { data: undefined }
			},
			invalidatesTags: ["firebaseApp"],
		}),
		// изменение версии приложения
		changeAppVersion: builder.mutation<void, { version: string }>({
			async queryFn({ version }) {
				const appRef = doc(db, "app", "info")

				await updateDoc(appRef, {
					version,
				})

				return { data: undefined }
			},
			invalidatesTags: ["firebaseApp"],
		}),
		// пока аввторизации через вк
		changeShowVkAuth: builder.mutation<void, { showVKAuth: boolean }>({
			async queryFn({ showVKAuth }) {
				const appRef = doc(db, "app", "info")

				await updateDoc(appRef, {
					showVKAuth,
				})

				return { data: undefined }
			},
			invalidatesTags: ["firebaseApp"],
		}),
		// изменение соц сетей
		changeSocials: builder.mutation<void, { socials: ISocial[] }>({
			async queryFn({ socials }) {
				const appRef = doc(db, "app", "info")

				await updateDoc(appRef, {
					socials,
				})

				return { data: undefined }
			},
			invalidatesTags: ["firebaseApp"],
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
