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
}

export type GetUserYearStatsParams = {
	userId: number | string
	year?: number
}
