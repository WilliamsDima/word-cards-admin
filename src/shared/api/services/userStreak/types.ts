/** Сырые значения серии пользователя (без учёта пропущенных дней) */
export type UserStreak = {
	current_streak: number
	longest_streak: number
	/** YYYY-MM-DD или null, если пользователь ещё не завершал ни одного дня */
	last_completed_date: string | null
}

export type UpdateUserStreakPayload = {
	userId: number | string
	/** 0..MAX_ADMIN_STREAK_VALUE */
	current_streak: number
	/** 0..MAX_ADMIN_STREAK_VALUE, >= current_streak. Без него бэкенд берёт max(сохранённый, current) */
	longest_streak?: number
	/** YYYY-MM-DD, не позже завтрашнего дня (UTC) и не раньше MIN_ADMIN_STREAK_DATE */
	last_completed_date?: string
}

/** Верхняя граница значений серии на бэкенде */
export const MAX_ADMIN_STREAK_VALUE = 100000

/** Самая ранняя допустимая last_completed_date на бэкенде */
export const MIN_ADMIN_STREAK_DATE = "2000-01-01"
