import { useCallback, useEffect, useRef, useState } from "react"
import { fetchLatestRelease } from "./latestRelease"
import type { LatestReleaseState } from "./types"

const LOADING_STATE: LatestReleaseState = { status: "loading" }

export const useLatestRelease = () => {
	const [state, setState] = useState<LatestReleaseState>(LOADING_STATE)
	const controllerRef = useRef<AbortController | null>(null)

	const request = useCallback(async () => {
		controllerRef.current?.abort()
		const controller = new AbortController()
		controllerRef.current = controller

		const next = await fetchLatestRelease(controller.signal)
		if (next) setState(next)
	}, [])

	const retry = useCallback(() => {
		setState(LOADING_STATE)
		request()
	}, [request])

	useEffect(() => {
		request()
		return () => controllerRef.current?.abort()
	}, [request])

	return { state, retry }
}
