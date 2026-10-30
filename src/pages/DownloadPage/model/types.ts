/** Поля релиза, общие для `/apk/latest.json` и записей `/apk/releases.json`. */
export type ReleaseInfo = {
	versionName: string
	versionCode: number | null
	fileName: string
	url: string
	latestUrl: string
	size: number | null
	sha256: string
	publishedAt: string
	commit: string
	changelog: string
}

/** Описание последнего релиза из `/apk/latest.json` (schemaVersion 1). */
export type LatestRelease = ReleaseInfo & {
	schemaVersion: 1
}

/** Запись из `/apk/releases.json`: без versionCode её не сравнить с текущей версией. */
export type ListedRelease = ReleaseInfo & {
	versionCode: number
}

export type LatestReleaseState =
	| { status: "loading" }
	/** latest.json отсутствует (404) — релизов ещё не было. */
	| { status: "empty" }
	| { status: "error"; message: string }
	| { status: "ready"; release: LatestRelease }
	/** Неизвестная schemaVersion или неполные данные — даём хотя бы ссылку. */
	| { status: "fallback"; downloadUrl: string }
