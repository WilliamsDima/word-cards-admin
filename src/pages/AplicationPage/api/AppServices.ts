import { doc, updateDoc } from "firebase/firestore"
import { baseRTK } from "@app/api/BaseRTK"
import { db } from "@shared/config/firebase"

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
	}),
})

export const {
	useChangeAppNameMutation,
	useChangeShowVkAuthMutation,
	useChangePrivacyPolicyLinkMutation,
} = appAPI
