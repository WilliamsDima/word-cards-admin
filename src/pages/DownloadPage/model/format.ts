import { dateService } from "@shared/lib/date"

const BYTES_IN_MB = 1024 * 1024
const DATE_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: "long" }
const SIZE_FORMAT: Intl.NumberFormatOptions = { maximumFractionDigits: 1 }

export const formatReleaseVersion = (
	versionName: string,
	versionCode: number | null,
): string =>
	versionCode === null ? versionName : `${versionName} (${versionCode})`

export const formatReleaseDate = (publishedAt: string): string | null =>
	publishedAt ? dateService.format(publishedAt, DATE_FORMAT) : null

export const formatReleaseSize = (size: number | null): string | null =>
	size === null || size <= 0
		? null
		: `${(size / BYTES_IN_MB).toLocaleString("ru-RU", SIZE_FORMAT)} МБ`
