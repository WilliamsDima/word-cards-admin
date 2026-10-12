import type { LatestRelease, LatestReleaseState } from "./types"

/**
 * Статический файл, который Caddy отдаёт с того же домена (no-store).
 * Это не API бэкенда и токен не нужен, поэтому запрос идёт обычным `fetch`,
 * а не через `baseRTK` (тот ходит на VITE_API_BASE_URL и подставляет Bearer).
 */
const LATEST_JSON_URL = "/apk/latest.json"

/** Постоянная ссылка на последний APK — запасной вариант, если latest.json не разобрать. */
export const FALLBACK_APK_URL = "/apk/word-cards-latest.apk"

const SUPPORTED_SCHEMA_VERSION = 1

type JsonRecord = Record<string, unknown>

const isRecord = (value: unknown): value is JsonRecord =>
	typeof value === "object" && value !== null && !Array.isArray(value)

const readString = (source: JsonRecord, key: string): string => {
	const value = source[key]
	return typeof value === "string" ? value.trim() : ""
}

const readNumber = (source: JsonRecord, key: string): number | null => {
	const value = source[key]
	return typeof value === "number" && Number.isFinite(value) ? value : null
}

const toFallback = (source: JsonRecord | null): LatestReleaseState => ({
	status: "fallback",
	downloadUrl:
		(source ? readString(source, "latestUrl") : "") || FALLBACK_APK_URL,
})

export const parseLatestRelease = (raw: unknown): LatestReleaseState => {
	if (!isRecord(raw)) return toFallback(null)
	if (raw.schemaVersion !== SUPPORTED_SCHEMA_VERSION) return toFallback(raw)

	const url = readString(raw, "url")
	const versionName = readString(raw, "versionName")
	if (!url || !versionName) return toFallback(raw)

	const release: LatestRelease = {
		schemaVersion: SUPPORTED_SCHEMA_VERSION,
		versionName,
		versionCode: readNumber(raw, "versionCode"),
		fileName: readString(raw, "fileName"),
		url,
		latestUrl: readString(raw, "latestUrl") || FALLBACK_APK_URL,
		size: readNumber(raw, "size"),
		sha256: readString(raw, "sha256"),
		publishedAt: readString(raw, "publishedAt"),
		commit: readString(raw, "commit"),
		changelog: readString(raw, "changelog"),
	}

	return { status: "ready", release }
}

const isAbortError = (error: unknown) =>
	error instanceof DOMException && error.name === "AbortError"

/**
 * Загружает и разбирает latest.json. Никогда не бросает: ошибки сети/сервера
 * превращаются в состояние `error`. Возвращает `null`, если запрос отменён.
 */
export const fetchLatestRelease = async (
	signal: AbortSignal,
): Promise<LatestReleaseState | null> => {
	try {
		const response = await fetch(LATEST_JSON_URL, {
			cache: "no-store",
			signal,
		})

		if (response.status === 404) return { status: "empty" }
		if (!response.ok) {
			return {
				status: "error",
				message: `Сервер ответил ошибкой ${response.status}.`,
			}
		}

		// Если файла нет, а сервер отдал SPA-fallback (index.html) со статусом 200,
		// это тоже означает «релизов пока нет».
		const contentType = response.headers.get("content-type") ?? ""
		if (contentType.includes("text/html")) return { status: "empty" }

		const json: unknown = await response.json()
		return parseLatestRelease(json)
	} catch (error) {
		if (isAbortError(error)) return null
		if (error instanceof SyntaxError) {
			return {
				status: "error",
				message: "Не удалось прочитать информацию о релизе.",
			}
		}
		return {
			status: "error",
			message: "Не удалось связаться с сервером. Проверьте подключение к интернету.",
		}
	}
}
