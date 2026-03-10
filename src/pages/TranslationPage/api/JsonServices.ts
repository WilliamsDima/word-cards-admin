import { baseRTK } from "@app/api/BaseRTK"
import type { TranslationKeys } from "@shared/api/types"

type AddKeyTranslateType = {
	langCode: TranslationKeys
}

const notImplemented = {
	status: 501,
	data: "Not implemented: backend endpoints are not wired yet",
}

export const jsonAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		// создание ключа файла для переводов
		addKeyTranslate: builder.mutation<void, AddKeyTranslateType>({
			async queryFn() {
				return { error: notImplemented }
			},
		}),
	}),
})

export const { useAddKeyTranslateMutation } = jsonAPI
