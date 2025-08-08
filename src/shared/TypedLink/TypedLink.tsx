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
	let path = AppRoutes[route] as string

	if (params) {
		Object.entries(params).forEach(([key, value]) => {
			path = path.replace(`:${key}`, String(value))
		})
	}

	return <Link to={path} {...rest} />
}
