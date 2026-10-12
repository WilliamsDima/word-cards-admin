import type { AchievementMetric } from "@shared/api/services/achievements/types"

export type UserAchievement = {
	id: number
	code: string
	title: string
	description: string | null
	icon: string | null
	color_from: string | null
	color_to: string | null
	metric: AchievementMetric
	threshold: number
	sort_order: number
	is_active: boolean
	created_at: string
	updated_at: string
	progress_current: number
	progress_percent: number
	unlocked: boolean
	unlocked_at: string | null
	/** Пользователь уже видел модалку разблокировки (для заблокированных всегда false) */
	seen: boolean
}

export type GetUserAchievementsResponse = {
	items: UserAchievement[]
}

export type ResetUserAchievementPayload = {
	userId: number | string
	achievementId: number
}

export type ResetUserAchievementResponse = {
	reset: boolean
}

export type ResetUserAchievementSeenPayload = ResetUserAchievementPayload

/** Тот же формат, что у GET списка достижений пользователя (с обновлённым seen) */
export type ResetUserAchievementSeenResponse = GetUserAchievementsResponse
