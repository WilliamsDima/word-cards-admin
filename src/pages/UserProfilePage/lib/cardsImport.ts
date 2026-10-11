import type { CardsImportReport } from "@shared/api/services/cards/types"

const isRecord = (value: unknown): value is Record<string, unknown> =>
	typeof value === "object" && value !== null && !Array.isArray(value)

const isImportReport = (value: unknown): value is CardsImportReport =>
	isRecord(value) &&
	typeof value.valid === "boolean" &&
	typeof value.errors_total === "number" &&
	Array.isArray(value.errors)

const serverErrorLabels: Record<string, string> = {
	"invalid user id": "Некорректный id пользователя",
	"invalid body": "Не удалось прочитать тело запроса",
	"import file is invalid": "Файл содержит ошибки — импорт невозможен",
}

export type CardsImportFailure = {
	/** Отчёт, если бэкенд вернул его вместе с 400 */
	report: CardsImportReport | null
	message: string
}

/**
 * Разбирает ошибку мутации импорта (FetchBaseQueryError из toRtkQueryResult):
 * error.data — ServiceError, error.data.data — тело ответа бэкенда.
 */
export const parseCardsImportError = (
	err: unknown,
	fallback: string,
): CardsImportFailure => {
	const error = err as { status?: number | string; data?: { data?: unknown } }
	const body = error?.data?.data
	const report = isImportReport(body) ? body : null
	const serverError =
		isRecord(body) && typeof body.error === "string" ? body.error : null

	if (error?.status === 413) {
		return { report, message: "Файл слишком большой (максимум 10 МБ)" }
	}
	if (error?.status === 404) {
		return { report, message: "Пользователь не найден" }
	}
	if (serverError) {
		return { report, message: serverErrorLabels[serverError] ?? serverError }
	}
	return { report, message: fallback }
}

export const formatFileSize = (bytes: number) => {
	if (bytes < 1024) return `${bytes} Б`
	if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} КБ`
	return `${(bytes / (1024 * 1024)).toFixed(1)} МБ`
}
