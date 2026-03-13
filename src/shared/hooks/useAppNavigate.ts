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
			? [params?: undefined, options?: { replace?: boolean; state?: unknown }]
			: [params: PathToParams<T>, options?: { replace?: boolean; state?: unknown }]
	) => {
		const [params, options] = rest
		const resolvedPath = params
			? (Object.entries(params) as [keyof typeof params, string][]).reduce(
					(acc, [key, value]) =>
						acc.replace(`:${String(key)}`, String(value)),
					path as string,
				)
			: (path as string)

		navigate(resolvedPath, options)
	}
}
