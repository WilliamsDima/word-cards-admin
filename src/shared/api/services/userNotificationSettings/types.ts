/** Настройки push-уведомлений пользователя */
export type UserNotificationSettings = {
	daily_reminder_enabled: boolean
	/** HH:MM по часам устройства пользователя; серверная настройка, только чтение */
	daily_reminder_time: string
	/** Сколько устройств зарегистрировано для пушей */
	devices_count: number
	/** YYYY-MM-DD по местному времени устройства или null, если не отправлялось */
	last_reminder_date: string | null
}

export type UpdateUserNotificationSettingsPayload = {
	userId: number | string
	daily_reminder_enabled: boolean
}

/** Лимиты бэкенда для ручного push-уведомления (в символах) */
export const MAX_PUSH_TITLE_LENGTH = 100
export const MAX_PUSH_BODY_LENGTH = 1000
/** Заголовок, который сервер подставит, если title пустой или не передан */
export const DEFAULT_PUSH_TITLE = "Word Cards"

export type SendUserPushNotificationPayload = {
	userId: number | string
	/** Необязателен: пусто/нет — сервер подставит DEFAULT_PUSH_TITLE */
	title?: string
	body: string
}

/** Результат ручной отправки push-уведомления */
export type SendUserPushNotificationResponse = {
	/** Сколько устройств было зарегистрировано на момент отправки */
	devices_count: number
	sent: number
	failed: number
	/** Сколько невалидных FCM-токенов сервер удалил */
	removed_invalid_tokens: number
}
