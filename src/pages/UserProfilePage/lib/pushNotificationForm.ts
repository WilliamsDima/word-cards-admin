import {
	MAX_PUSH_BODY_LENGTH,
	MAX_PUSH_TITLE_LENGTH,
	type SendUserPushNotificationResponse,
} from "@shared/api/services/userNotificationSettings/types"

export type PushFormValues = {
	title: string
	body: string
}

export type PushFormErrors = Partial<Record<keyof PushFormValues, string>>

export type ParsedPushForm = {
	title?: string
	body: string
}

export type PushSendResultKind = "success" | "partial" | "error"

export type PushSendResult = {
	kind: PushSendResultKind
	title: string
	message: string
}

export const EMPTY_PUSH_FORM: PushFormValues = { title: "", body: "" }

/** Длина в символах (code points), а не в UTF-16 единицах — эмодзи считаются за 1 */
export const getTextLength = (value: string) => [...value].length

export const validatePushForm = (
	values: PushFormValues,
): { errors: PushFormErrors; parsed: ParsedPushForm | null } => {
	const title = values.title.trim()
	const body = values.body.trim()

	const titleError =
		getTextLength(title) > MAX_PUSH_TITLE_LENGTH
			? `Не длиннее ${MAX_PUSH_TITLE_LENGTH} символов`
			: undefined

	const bodyError = (() => {
		if (!body) return "Введите текст уведомления"
		if (getTextLength(body) > MAX_PUSH_BODY_LENGTH) {
			return `Не длиннее ${MAX_PUSH_BODY_LENGTH.toLocaleString("ru-RU")} символов`
		}
		return undefined
	})()

	const errors: PushFormErrors = {
		...(titleError ? { title: titleError } : {}),
		...(bodyError ? { body: bodyError } : {}),
	}

	if (titleError || bodyError) return { errors, parsed: null }

	return {
		errors,
		parsed: {
			...(title ? { title } : {}),
			body,
		},
	}
}

const ERROR_TITLES: Record<number, string> = {
	400: "Некорректные данные",
	404: "Пользователь не найден",
	409: "Нет устройств для отправки",
	502: "FCM не принял уведомление — можно повторить",
	503: "Push-уведомления не настроены на сервере",
}

export const buildPushSuccessResult = (
	response: SendUserPushNotificationResponse,
): PushSendResult => {
	const { devices_count, sent, failed, removed_invalid_tokens } = response
	const isPartial = failed > 0
	const details = [
		`Доставлено: ${sent} из ${devices_count}`,
		isPartial ? `ошибок: ${failed}` : "",
		removed_invalid_tokens > 0
			? `удалено невалидных токенов: ${removed_invalid_tokens}`
			: "",
	]
		.filter(Boolean)
		.join(", ")

	return {
		kind: isPartial ? "partial" : "success",
		title: isPartial ? "Отправлено частично" : "Уведомление отправлено",
		message: details,
	}
}

/** Ошибка из unwrap() мутации: { status, data: ServiceError { data: { error } } } */
export const buildPushErrorResult = (err: unknown): PushSendResult => {
	const typed = err as
		| { status?: number | string; data?: { data?: { error?: string } } }
		| undefined
	const status = typed?.status
	const serverError = typed?.data?.data?.error ?? ""

	const title =
		typeof status === "number"
			? (ERROR_TITLES[status] ?? `Ошибка отправки (HTTP ${status})`)
			: "Не удалось связаться с сервером"

	return {
		kind: "error",
		title,
		message: serverError || "Не удалось отправить уведомление",
	}
}
