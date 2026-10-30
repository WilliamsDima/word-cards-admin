import { useEffect, useMemo, useState } from "react"
import { fetchReleasesList, selectPreviousReleases } from "./previousReleases"
import type { ListedRelease } from "./types"

const NO_RELEASES: ListedRelease[] = []

/** Список запрашивается, только когда известна текущая версия: без неё сравнивать не с чем. */
export const usePreviousReleases = (latestVersionCode: number | null) => {
	const [releases, setReleases] = useState<ListedRelease[]>(NO_RELEASES)

	const previousReleases = useMemo(
		() => selectPreviousReleases(releases, latestVersionCode),
		[releases, latestVersionCode],
	)

	useEffect(() => {
		if (latestVersionCode === null) return

		const controller = new AbortController()
		const request = async () => {
			const next = await fetchReleasesList(controller.signal)
			if (next) setReleases(next)
		}
		request()

		return () => controller.abort()
	}, [latestVersionCode])

	return previousReleases
}
