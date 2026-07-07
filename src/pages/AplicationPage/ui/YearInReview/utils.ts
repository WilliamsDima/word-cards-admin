import type { IYearInReviewTranslation } from "@shared/api/services/appConfig/types"

export type LanguageOption = {
	code: string
	name: string
}

export type TranslationsDraft = Record<string, IYearInReviewTranslation>

export const buildTranslationsDraft = (
	translations: TranslationsDraft,
	languageCodes: string[],
): TranslationsDraft => {
	const result: TranslationsDraft = {}
	languageCodes.forEach(code => {
		const entry = translations[code]
		result[code] = {
			title: entry?.title ?? "",
			description: entry?.description ?? "",
		}
	})
	return result
}

export const areTranslationsEqual = (
	a: TranslationsDraft,
	b: TranslationsDraft,
	languageCodes: string[],
): boolean => {
	return languageCodes.every(code => {
		const left = a[code]
		const right = b[code]
		return (
			(left?.title ?? "") === (right?.title ?? "") &&
			(left?.description ?? "") === (right?.description ?? "")
		)
	})
}

export const countFilledTranslations = (
	translations: TranslationsDraft,
	languageCodes: string[],
): number => {
	return languageCodes.filter(code => {
		const entry = translations[code]
		return Boolean(entry?.title?.trim().length || entry?.description?.trim().length)
	}).length
}
