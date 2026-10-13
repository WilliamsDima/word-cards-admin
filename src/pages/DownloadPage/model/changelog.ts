/**
 * Заметки к релизу из поля `changelog` в latest.json.
 *
 * Новые релизы кладут туда компактный JSON вида `{"ru": ["пункт", ...], "en": [...]}`
 * (ключи — двухбуквенные коды языков, значения — непустые массивы строк).
 * Старые релизы — обычный текст (например, заголовок коммита).
 */
export type ReleaseChangelog =
	| { kind: "empty" }
	| { kind: "text"; text: string }
	| { kind: "list"; items: string[] }

const PREFERRED_LANGUAGES = ["ru", "en"] as const
const LANGUAGE_CODE_PATTERN = /^[a-z]{2}$/

type ReleaseNotes = Record<string, string[]>

const parseJson = (raw: string): unknown => {
	try {
		return JSON.parse(raw)
	} catch {
		return null
	}
}

const isNotesItems = (value: unknown): value is string[] =>
	Array.isArray(value) &&
	value.length > 0 &&
	value.every((item) => typeof item === "string" && item.trim().length > 0)

/** Возвращает заметки, только если JSON целиком соответствует ожидаемой форме. */
const toReleaseNotes = (value: unknown): ReleaseNotes | null => {
	if (typeof value !== "object" || value === null || Array.isArray(value)) {
		return null
	}

	const entries = Object.entries(value)
	if (entries.length === 0) return null

	const notes: ReleaseNotes = {}
	for (const [language, items] of entries) {
		if (!LANGUAGE_CODE_PATTERN.test(language) || !isNotesItems(items)) return null
		notes[language] = items.map((item) => item.trim())
	}

	return notes
}

/** Пункты на `ru`, иначе на `en`, иначе на первом доступном языке. */
const pickItems = (notes: ReleaseNotes): string[] => {
	const preferred = PREFERRED_LANGUAGES.find((language) => language in notes)
	return notes[preferred ?? Object.keys(notes)[0]]
}

/**
 * Разбирает `changelog`. Никогда не бросает: всё, что не является JSON-объектом
 * ожидаемой формы (обычный текст, невалидный JSON, другая структура), выводится
 * как текст.
 */
export const parseReleaseChangelog = (raw: string): ReleaseChangelog => {
	const text = raw.trim()
	if (!text) return { kind: "empty" }

	const notes = text.startsWith("{") ? toReleaseNotes(parseJson(text)) : null
	if (!notes) return { kind: "text", text }

	return { kind: "list", items: pickItems(notes) }
}
