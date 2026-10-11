import type { JsonValue } from "@shared/api/services/languages/types"

/** JSON перевода языка (вложенные объекты, листья — строки) */
export type TranslationDictionary = Record<string, unknown>

export type TranslationPreview =
	| { status: "found"; text: string }
	| { status: "missing" }

/** Язык, из которого по умолчанию берётся превью ключей */
export const PREVIEW_LANGUAGE_CODE = "ru"

const PLURAL_SUFFIXES = ["one", "few", "many", "other"] as const

const pluralRules = new Intl.PluralRules(PREVIEW_LANGUAGE_CODE)

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value)

export const toTranslationDictionary = (
	json: JsonValue | undefined,
): TranslationDictionary | null => (isRecord(json) ? json : null)

const getByPath = (dictionary: TranslationDictionary, path: string): unknown =>
	path
		.split(".")
		.reduce<unknown>(
			(acc, part) => (isRecord(acc) ? acc[part] : undefined),
			dictionary,
		)

const interpolateCount = (text: string, count: number | undefined) =>
	count === undefined ? text : text.replace(/{{\s*count\s*}}/g, String(count))

/**
 * Ищет ключ (вложенный путь через точки) в JSON перевода, как это делает i18next.
 * Если строки по ключу нет — пробует плюральные формы `<key>_one/_few/_many/_other`,
 * подбирая форму через Intl.PluralRules('ru') по count и подставляя {{count}}.
 * Возвращает null, если ключ пустой или словаря нет (нечего проверять).
 */
export const resolveTranslationPreview = (
	dictionary: TranslationDictionary | null,
	rawKey: string | null | undefined,
	count?: number,
): TranslationPreview | null => {
	const key = rawKey?.trim() ?? ""
	if (!key || !dictionary) return null

	const direct = getByPath(dictionary, key)
	if (typeof direct === "string") {
		return { status: "found", text: interpolateCount(direct, count) }
	}

	const suffixes =
		count === undefined
			? ["other", ...PLURAL_SUFFIXES]
			: [pluralRules.select(count), "other", ...PLURAL_SUFFIXES]

	const pluralText = suffixes
		.map(suffix => getByPath(dictionary, `${key}_${suffix}`))
		.find((value): value is string => typeof value === "string")

	if (pluralText !== undefined) {
		return { status: "found", text: interpolateCount(pluralText, count) }
	}

	return { status: "missing" }
}
