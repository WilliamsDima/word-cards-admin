import { IUser } from "../model/user"

export const getLastActiveDay = (user: IUser): string | null => {
	try {
		const years = Object.keys(user.activity?.year || {})
		if (years.length === 0) return null

		const lastYear = Math.max(...years.map(Number))
		const months = Object.keys(user.activity.year[lastYear] || {})
		if (months.length === 0) return null

		const lastMonth = Math.max(...months.map(Number))
		const activeDays = user.activity.year[lastYear][lastMonth]?.activeDays || []

		return activeDays[activeDays.length - 1] || null
	} catch (error) {
		return error
	}
}
