import React, { memo, useCallback } from "react"
import type { NoParamsRoutePath } from "./Sidebar"

type Props = {
	route: NoParamsRoutePath
	name: string
	icon: React.ReactNode
	className: string
	onClick: (route: NoParamsRoutePath) => void
}

const SidebarNavItem: React.FC<Props> = memo(
	({ route, name, icon, className, onClick }) => {
		const onClickHandler = useCallback(() => onClick(route), [onClick, route])

		return (
			<button className={className} onClick={onClickHandler}>
				{icon}

				<span>{name}</span>
			</button>
		)
	},
)

export default SidebarNavItem
