import { AppRoutePath, RouteParams } from "@app/navigation/routes"
import { useNavigate } from "react-router-dom"

type PathToParams<T extends AppRoutePath> = T extends keyof RouteParams
	? RouteParams[T]
	: never

export function useAppNavigate() {
	const navigate = useNavigate()

	return <T extends AppRoutePath>(
		path: T,
		...rest: PathToParams<T> extends undefined
			? [params?: undefined, options?: { replace?: boolean }]
			: [params: PathToParams<T>, options?: { replace?: boolean }]
	) => {
		const [params, options] = rest
		let resolvedPath = path as string

		if (params) {
			;(Object.entries(params) as [keyof typeof params, string][]).forEach(
				([key, value]) => {
					resolvedPath = resolvedPath.replace(`:${String(key)}`, String(value))
				}
			)
		}

		navigate(resolvedPath, options)
	}
}
