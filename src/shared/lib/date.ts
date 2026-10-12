import dayjs from "dayjs"
import "dayjs/locale/ru"

const MONTH_FORMAT = "MMMM"
const ISO_DATE_FORMAT = "YYYY-MM-DD"
const ISO_DATE_REGEXP = /^\d{4}-\d{2}-\d{2}$/

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

	/** Локальная дата в формате YYYY-MM-DD со сдвигом на offsetDays дней от сегодня */
	getLocalISODate(offsetDays: number = 0) {
		return dayjs().add(offsetDays, "day").format(ISO_DATE_FORMAT)
	}

	/** Дата по UTC в формате YYYY-MM-DD со сдвигом на offsetDays дней от сегодня */
	getUtcISODate(offsetDays: number = 0) {
		const now = new Date()
		const utcMidnight = Date.UTC(
			now.getUTCFullYear(),
			now.getUTCMonth(),
			now.getUTCDate() + offsetDays,
		)
		return new Date(utcMidnight).toISOString().slice(0, ISO_DATE_FORMAT.length)
	}

	/** Строгая проверка строки YYYY-MM-DD (включая существование даты) */
	isValidISODate(value: string) {
		if (!ISO_DATE_REGEXP.test(value)) return false
		return dayjs(value).format(ISO_DATE_FORMAT) === value
	}

	/** Форматирование календарной даты YYYY-MM-DD без сдвига часового пояса */
	formatISODate(
		value: string,
		options: Intl.DateTimeFormatOptions = { dateStyle: "medium" },
	) {
		if (!this.isValidISODate(value)) return null
		return this.format(dayjs(value).toDate(), options)
	}

	isSameDay(value: DateInput, compareTo: DateInput = new Date()) {
		const left = this.parseDate(value)
		const right = this.parseDate(compareTo)
		if (!left || !right) return false
		return left.toDateString() === right.toDateString()
	}
}

export const dateService = new DateService()
