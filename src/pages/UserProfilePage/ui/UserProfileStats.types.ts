import type { UserStatsYear } from "@shared/api/services/userStats/types"

export type YearOption = {
	label: string
	value: UserStatsYear
}

export type StatItem = {
	id: string
	label: string
	value: string
	hint?: string
}
