import { useMemo } from "react"
import { useGetLanguagesQuery } from "@shared/api/services/languages/LanguagesQuery"
import {
	PREVIEW_LANGUAGE_CODE,
	toTranslationDictionary,
	type TranslationDictionary,
} from "@shared/lib/translationPreview"

/**
 * JSON перевода языка (по умолчанию ru) для превью ключей перевода.
 * Вызывать один раз в контейнере/странице и передавать результат вниз через props —
 * не в элементах списка (внутри подписка RTK Query).
 */
export const useTranslationDictionary = (
	code: string = PREVIEW_LANGUAGE_CODE,
): TranslationDictionary | null => {
	const { data } = useGetLanguagesQuery()

	return useMemo(() => {
		if (!data) return null
		const language = Object.values(data).find(item => item.code === code)
		return toTranslationDictionary(language?.json)
	}, [code, data])
}
