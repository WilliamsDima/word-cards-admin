import dayjs from "dayjs"
import "dayjs/locale/ru"

const MONTH_FORMAT = "MMMM"

type DateInput = Date | string | number

const capitalize = (value: string) => {
	if (!value) return value
	return `${value.charAt(0).toUpperCase()}${value.slice(1)}`
}

class DateService {
	private parseDate(value: DateInput) {
		const date = value instanceof Date ? value : new Date(value)
		return Number.isNaN(date.getTime()) ? null : date
	}

	getMonthLabel(monthNumber: number) {
		if (monthNumber < 1 || monthNumber > 12) return null
		const label = dayjs()
			.locale("ru")
			.month(monthNumber - 1)
			.format(MONTH_FORMAT)
		return capitalize(label)
	}

	getTimestamp() {
		return Date.now()
	}

	getCurrentYear() {
		return new Date().getFullYear()
	}

	format(
		value: DateInput,
		options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
		locale: string = "ru-RU",
	) {
		const date = this.parseDate(value)
		if (!date) return null
		return new Intl.DateTimeFormat(locale, options).format(date)
	}

	isSameDay(value: DateInput, compareTo: DateInput = new Date()) {
		const left = this.parseDate(value)
		const right = this.parseDate(compareTo)
		if (!left || !right) return false
		return left.toDateString() === right.toDateString()
	}
}

export const dateService = new DateService()
