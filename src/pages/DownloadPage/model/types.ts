/** Описание последнего релиза из `/apk/latest.json` (schemaVersion 1). */
export type LatestRelease = {
	schemaVersion: 1
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

export type LatestReleaseState =
	| { status: "loading" }
	/** latest.json отсутствует (404) — релизов ещё не было. */
	| { status: "empty" }
	| { status: "error"; message: string }
	| { status: "ready"; release: LatestRelease }
	/** Неизвестная schemaVersion или неполные данные — даём хотя бы ссылку. */
	| { status: "fallback"; downloadUrl: string }
