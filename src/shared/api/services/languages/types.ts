export const TRANSLATION_KEYS = [
	"ru",
	"uk",
	"be",
	"ka",
	"uz",
	"az",
	"tg",
	"en",
	"de",
	"fr",
	"es",
	"it",
	"pt",
	"nl",
	"sv",
	"no",
	"fi",
	"da",
	"pl",
	"cs",
	"hu",
	"tr",
	"ar",
	"he",
	"zh",
	"ja",
	"ko",
	"hi",
	"bn",
	"pa",
	"vi",
	"th",
	"id",
	"ms",
	"fa",
	"sw",
	"ro",
] as const

export type TranslationKeys = (typeof TRANSLATION_KEYS)[number]

export const isTranslationKey = (value: string): value is TranslationKeys =>
	TRANSLATION_KEYS.includes(value as TranslationKeys)

export type JsonValue =
	| Record<string, unknown>
	| unknown[]
	| string
	| number
	| boolean
	| null

export type LanguageItem = {
	id: number
	code: string
	emoji: string
	name: string
	json: JsonValue
	updated_at: string
}

export type LanguagesMap = Record<TranslationKeys, LanguageItem>

export type LanguagePayload = Omit<LanguageItem, "id" | "updated_at">
