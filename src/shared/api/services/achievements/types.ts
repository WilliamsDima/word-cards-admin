export type AchievementMetric =
	| "CARDS_CREATED"
	| "CARDS_REVIEWED"
	| "TRAININGS_COUNT"
	| "CARDS_READY"
	| "STREAK_LONGEST"
	| "LANGUAGES_COUNT"

export const ACHIEVEMENT_METRICS: AchievementMetric[] = [
	"CARDS_CREATED",
	"CARDS_REVIEWED",
	"TRAININGS_COUNT",
	"CARDS_READY",
	"STREAK_LONGEST",
	"LANGUAGES_COUNT",
]

export const achievementMetricLabels: Record<AchievementMetric, string> = {
	CARDS_CREATED: "Создано карточек",
	CARDS_REVIEWED: "Повторено карточек",
	TRAININGS_COUNT: "Количество тренировок",
	CARDS_READY: "Карточек готово",
	STREAK_LONGEST: "Самая длинная серия дней",
	LANGUAGES_COUNT: "Количество языков",
}

export type Achievement = {
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
}

export type GetAchievementsResponse = {
	items: Achievement[]
}

export type AchievementPayload = {
	code: string
	title: string
	description?: string
	icon?: string
	color_from?: string
	color_to?: string
	metric: AchievementMetric
	threshold: number
	sort_order?: number
	is_active?: boolean
}

export type DeleteAchievementResponse = {
	deleted: number
}
