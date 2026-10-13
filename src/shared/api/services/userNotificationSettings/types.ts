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
