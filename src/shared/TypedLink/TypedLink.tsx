import { AppRouteKey, AppRoutes, RouteParams } from "@app/navigation/routes"
import { Link, LinkProps } from "react-router-dom"

type TypedLinkProps<T extends AppRouteKey> = Omit<LinkProps, "to"> & {
	route: T
	params?: RouteParams[T]
}

export function TypedLink<T extends AppRouteKey>({
	route,
	params,
	...rest
}: TypedLinkProps<T>) {
	const basePath = AppRoutes[route] as string
	const path = params
		? Object.entries(params).reduce(
				(acc, [key, value]) => acc.replace(`:${key}`, String(value)),
				basePath,
			)
		: basePath

	return <Link to={path} {...rest} />
}
