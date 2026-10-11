export type CardStatus = "READY" | "STUDY"

export const statusLabels: Record<CardStatus, string> = {
	READY: "Готово",
	STUDY: "В изучении",
}

export const statusValues: Record<CardStatus, CardStatus> = {
	READY: "READY",
	STUDY: "STUDY",
}

export const statusVariants: Record<CardStatus, "success" | "warning"> = {
	READY: "success",
	STUDY: "warning",
}

export const statusOptions = [
	{ label: statusLabels.STUDY, value: statusValues.STUDY },
	{ label: statusLabels.READY, value: statusValues.READY },
]

export type UserCardItem = {
	id: number
	word: string
	translate: string
	date: string
}

export type UserCard = {
	id: number
	user_id: number
	language: string
	description: string
	status: CardStatus
	items: UserCardItem[]
	date: string
	updated_at: string
}

export type GetUserCardsResponse = {
	items: UserCard[]
	total: number
	limit: number
	offset: number
}

export type GetUserCardsParams = {
	userId: number | string
	search?: string
	status?: CardStatus
	languages?: string[]
	limit?: number
	offset?: number
}

export type CardItemPayload = {
	word: string
	translate: string
}

export type CreateUserCardPayload = {
	userId: number | string
	language: string
	description?: string
	status?: CardStatus
	items: CardItemPayload[]
}

export type UpdateUserCardPayload = {
	userId: number | string
	cardId: number
	language: string
	description?: string
	items: CardItemPayload[]
}

export type DeleteUserCardPayload = {
	userId: number | string
	cardId: number
}

export type UpdateUserCardStatusPayload = {
	userId: number | string
	cardId: number
	status: CardStatus
}

/** Лимит бэкенда на файл импорта карточек */
export const CARDS_IMPORT_MAX_BYTES = 10 * 1024 * 1024

export type CardsImportFormat = "envelope" | "legacy_array" | ""

export type CardsImportError = {
	/** Индекс карточки в файле; null — ошибка уровня файла */
	index: number | null
	field: string
	message: string
}

export type CardsImportLanguage = {
	code: string
	cards: number
}

/** Отчёт POST /admin/users/{userId}/cards/import (и для 200, и для 400) */
export type CardsImportReport = {
	dry_run: boolean
	imported: boolean
	valid: boolean
	format: CardsImportFormat
	version: number
	exported_at: string | null
	total_in_file: number
	cards_to_create: number
	items_to_create: number
	cards_to_delete: number
	languages: CardsImportLanguage[]
	statuses: Partial<Record<CardStatus, number>>
	errors: CardsImportError[]
	errors_total: number
	error?: string
}

export type ImportUserCardsPayload = {
	userId: number | string
	/** Сырое содержимое JSON-файла — отправляется телом запроса как есть */
	fileContent: string
}
