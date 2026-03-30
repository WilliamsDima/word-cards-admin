import dayjs from "dayjs"
import "dayjs/locale/ru"

const MONTH_FORMAT = "MMMM"

const capitalize = (value: string) => {
	if (!value) return value
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

class DateService {
	getMonthLabel(monthNumber: number) {
		if (monthNumber < 1 || monthNumber > 12) return null
		const label = dayjs()
			.locale("ru")
			.month(monthNumber - 1)
			.format(MONTH_FORMAT)
		return capitalize(label)
	}
}

export const dateService = new DateService()
