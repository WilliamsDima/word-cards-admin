import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { languagesService } from "./LanguagesService"
import type { LanguageItem, LanguagePayload, LanguagesMap } from "./types"

export const languagesAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getLanguages: builder.query<LanguagesMap, void>({
			async queryFn() {
				return toRtkQueryResult(await languagesService.getLanguages())
			},
			providesTags: ["languages"],
		}),
		createLanguage: builder.mutation<LanguageItem, LanguagePayload>({
			async queryFn(payload) {
				return toRtkQueryResult(await languagesService.createLanguage(payload))
			},
			invalidatesTags: ["languages"],
		}),
		updateLanguage: builder.mutation<
			LanguageItem,
			{ id: number; payload: LanguagePayload }
		>({
			async queryFn({ id, payload }) {
				return toRtkQueryResult(
					await languagesService.updateLanguage(id, payload),
				)
			},
			invalidatesTags: ["languages"],
		}),
		deleteLanguage: builder.mutation<{ ok: true }, number>({
			async queryFn(id) {
				return toRtkQueryResult(await languagesService.deleteLanguage(id))
			},
			invalidatesTags: ["languages"],
		}),
	}),
})

export const {
	useGetLanguagesQuery,
	useCreateLanguageMutation,
	useUpdateLanguageMutation,
	useDeleteLanguageMutation,
} = languagesAPI
