import { isAbortError, isRecord, readReleaseInfo, SUPPORTED_SCHEMA_VERSION } from "./latestRelease"
import type { ListedRelease } from "./types"

/**
 * Статический список последних релизов, отдаётся Caddy с того же домена, как и
 * latest.json. До первой загрузки APK после деплоя бэкенда файла нет (404).
 */
const RELEASES_JSON_URL = "/apk/releases.json"

const toListedRelease = (raw: unknown): ListedRelease | null => {
	if (!isRecord(raw)) return null

	const info = readReleaseInfo(raw)
	if (!info.url || !info.versionName || info.versionCode === null) return null

	return { ...info, versionCode: info.versionCode }
}

/**
 * Разбирает releases.json. Никогда не бросает: неизвестная схема или другая
 * структура дают пустой список, а битая запись пропускается, не мешая остальным.
 */
export const parseReleasesList = (raw: unknown): ListedRelease[] => {
	if (!isRecord(raw) || raw.schemaVersion !== SUPPORTED_SCHEMA_VERSION) return []
	if (!Array.isArray(raw.releases)) return []

	return raw.releases
		.map(toListedRelease)
		.filter((release): release is ListedRelease => release !== null)
}

/**
 * Предыдущие версии — всё, что младше текущей (новые сверху). Сравнение с
 * latest.json спасает от устаревшего списка. Без versionCode текущей версии
 * сравнивать не с чем, поэтому список пуст.
 */
export const selectPreviousReleases = (
	releases: ListedRelease[],
	latestVersionCode: number | null,
): ListedRelease[] => {
	if (latestVersionCode === null) return []

	return releases
		.filter((release) => release.versionCode < latestVersionCode)
		.sort((left, right) => right.versionCode - left.versionCode)
}

/**
 * Загружает и разбирает releases.json. Никогда не бросает: 404, ошибка сети или
 * невалидный JSON означают «предыдущих версий нет» и не должны мешать основной
 * кнопке скачивания. Возвращает `null`, если запрос отменён.
 */
export const fetchReleasesList = async (
	signal: AbortSignal,
): Promise<ListedRelease[] | null> => {
	try {
		const response = await fetch(RELEASES_JSON_URL, {
			cache: "no-store",
			signal,
		})
		if (!response.ok) return []

		const json: unknown = await response.json()
		return parseReleasesList(json)
	} catch (error) {
		return isAbortError(error) ? null : []
	}
}
