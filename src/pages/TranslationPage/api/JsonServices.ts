import { doc, updateDoc } from "firebase/firestore"
import { baseRTK } from "@app/api/BaseRTK"
import { db } from "@shared/config/firebase"
import type { TranslationKeys } from "@shared/api/types"

type AddKeyTranslateType = {
	langCode: TranslationKeys
}

export const jsonAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		// создание ключа файла для переводов
		addKeyTranslate: builder.mutation<void, AddKeyTranslateType>({
			async queryFn({ langCode }) {
				const infoRef = doc(db, "app", "info")

				const res = await updateDoc(infoRef, {
					[`translations.${langCode}`]: `${langCode}.json`,
				})

				return { data: res }
			},
			invalidatesTags: ["firebaseApp"],
		}),
	}),
})

export const { useAddKeyTranslateMutation } = jsonAPI
