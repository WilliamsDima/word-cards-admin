import React, { useMemo, useState } from "react"
import styles from "./Sidebar.module.scss"
import { logout } from "@shared/config/firebase"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import { AppRoutes } from "@app/navigation/routes"
import { useLocation } from "react-router-dom"
import cn from "classnames"
import Button from "@shared/Button/Button"
import ArrowIcon from "@assets/icons/arrow-expand-left.svg?react"
import LogoutIcon from "@assets/icons/logout.svg?react"
import UserIcon from "@assets/icons/user.svg?react"
import AppIcon from "@assets/icons/app.svg?react"
import SupportIcon from "@assets/icons/support.svg?react"

const routesNav = [
	{
		name: "Пользователи",
		route: AppRoutes.users,
		icon: <UserIcon />,
	},
	{
		name: "Приложение",
		route: AppRoutes.aplication,
		icon: <AppIcon />,
	},
	{
		name: "Поддержка",
		route: AppRoutes.chats,
		icon: <SupportIcon />,
	},
]

const Sidebar: React.FC = () => {
	const navigation = useAppNavigate()
	const location = useLocation()
	const [hidden, setHidden] = useState(false)

	const currentRoute = useMemo(() => {
		return location?.pathname
	}, [location])

	return (
		<aside
			className={cn(styles.sidebar, {
				[styles.hidden]: hidden,
			})}
		>
			<div className={styles.header}>
				<div
					className={styles.title}
					onClick={() => navigation(AppRoutes.main)}
				>
					{hidden ? "<A />" : "<Admin />"}
				</div>

				<button
					className={styles.arrow}
					onClick={() => setHidden(prev => !prev)}
				>
					<ArrowIcon />
				</button>
			</div>
			<nav className={styles.nav}>
				{routesNav.map(it => {
					return (
						<button
							key={it.route}
							className={cn(styles.navItem, {
								[styles.navItemActive]: currentRoute.includes(it.route),
							})}
							onClick={() => navigation(it.route)}
						>
							{it.icon}

							<span>{it.name}</span>
						</button>
					)
				})}
			</nav>
			<div className={styles.footer}>
				<Button className={styles.logoutBtn} onClick={logout}>
					<span>Выйти</span>

					<LogoutIcon />
				</Button>
			</div>
		</aside>
	)
}

export default Sidebar
