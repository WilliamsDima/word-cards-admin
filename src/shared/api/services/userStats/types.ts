export type UserYearStats = {
	year: number
	app_opens: number
	cards_created: number
	cards_reviewed: number
	trainings_count: number
	ads_viewed: number
	best_month: number
	best_month_cards_created: number
	longest_streak: number
	/** true только в ответе на `?year=all` (тогда year = 0) */
	all_time?: boolean
}

/** Значение параметра year для итогов за всё время */
export const USER_STATS_ALL_TIME = "all"

export type UserStatsYear = number | typeof USER_STATS_ALL_TIME

export type GetUserYearStatsParams = {
	userId: number | string
	/** Год, либо USER_STATS_ALL_TIME — итоги за всё время */
	year?: UserStatsYear
}
