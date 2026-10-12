import { dateService } from "@shared/lib/date"
import {
	MAX_ADMIN_STREAK_VALUE,
	MIN_ADMIN_STREAK_DATE,
} from "@shared/api/services/userStreak/types"

export type StreakFormValues = {
	currentStreak: string
	longestStreak: string
	lastCompletedDate: string
}

export type StreakFormErrors = Partial<Record<keyof StreakFormValues, string>>

export type ParsedStreakForm = {
	current_streak: number
	/** undefined — поле пустое, бэкенд возьмёт max(сохранённый, current) */
	longest_streak?: number
	last_completed_date: string
}

const INTEGER_REGEXP = /^\d+$/

const rangeError = `Целое число от 0 до ${MAX_ADMIN_STREAK_VALUE.toLocaleString("ru-RU")}`

/** Целое неотрицательное число в допустимом диапазоне, иначе null */
const parseStreakValue = (raw: string): number | null => {
	const value = raw.trim()
	if (!INTEGER_REGEXP.test(value)) return null
	const parsed = Number(value)
	return parsed <= MAX_ADMIN_STREAK_VALUE ? parsed : null
}

/**
 * Самая поздняя дата, которую примет бэкенд: «завтра по UTC».
 * Берём минимум с локальным «завтра», чтобы не предлагать дату из будущего админа.
 */
export const getMaxStreakDate = () => {
	const localTomorrow = dateService.getLocalISODate(1)
	const utcTomorrow = dateService.getUtcISODate(1)
	return localTomorrow < utcTomorrow ? localTomorrow : utcTomorrow
}

/** По умолчанию — вчера по локальному времени админа: серия жива и продолжится сегодня */
export const getDefaultStreakDate = () => dateService.getLocalISODate(-1)

export const validateStreakForm = (
	values: StreakFormValues,
	maxDate: string,
): { errors: StreakFormErrors; parsed: ParsedStreakForm | null } => {
	const current = parseStreakValue(values.currentStreak)
	const longestRaw = values.longestStreak.trim()
	const longest = longestRaw ? parseStreakValue(longestRaw) : undefined
	const date = values.lastCompletedDate.trim()

	const currentError = current === null ? rangeError : undefined

	const longestError = (() => {
		if (longest === null) return rangeError
		if (longest !== undefined && current !== null && longest < current) {
			return "Не может быть меньше текущей серии"
		}
		return undefined
	})()

	const dateError = (() => {
		if (!date) return "Укажите дату"
		if (!dateService.isValidISODate(date)) return "Дата в формате ГГГГ-ММ-ДД"
		if (date < MIN_ADMIN_STREAK_DATE) return "Не раньше 01.01.2000"
		if (date > maxDate) return "Не позже завтрашнего дня"
		return undefined
	})()

	const errors: StreakFormErrors = {
		...(currentError ? { currentStreak: currentError } : {}),
		...(longestError ? { longestStreak: longestError } : {}),
		...(dateError ? { lastCompletedDate: dateError } : {}),
	}

	if (current === null || longest === null || longestError || dateError) {
		return { errors, parsed: null }
	}

	return {
		errors,
		parsed: {
			current_streak: current,
			...(longest !== undefined ? { longest_streak: longest } : {}),
			last_completed_date: date,
		},
	}
}
