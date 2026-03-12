import { useCallback, useRef } from "react"

export const useDebounce = <T extends (...args: any[]) => void>(
	callback: T,
	delay: number,
) => {
	const timer = useRef<ReturnType<typeof setTimeout> | null>(null)

	const debouncedCallback = useCallback(
		(...args: Parameters<T>) => {
			if (timer.current) {
				clearTimeout(timer.current)
			}

			timer.current = setTimeout(() => {
				callback(...args)
			}, delay)
		},
		[callback, delay],
	)

	return debouncedCallback as (...args: Parameters<T>) => void
}
