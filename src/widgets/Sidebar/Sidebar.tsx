import React, { useMemo, useState } from "react"
import styles from "./Sidebar.module.scss"
import { useLogoutMutation } from "@shared/api/services/auth/AuthServices"
import { clearAuthToken } from "@shared/lib/authToken"
import { useActions } from "@shared/hooks/useActions"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import { AppRoutes } from "@app/navigation/routes"
import { useLocation } from "react-router-dom"
import cn from "classnames"
import Button from "@shared/Button/Button"
import { Icon } from "@assets/icons/Icon"

const routesNav = [
	{
		name: "Пользователи",
		route: AppRoutes.users,
		icon: <Icon name='user' width={32} height={32} />,
	},
	{
		name: "Приложение",
		route: AppRoutes.aplication,
		icon: <Icon name='app' width={32} height={32} />,
	},
	{
		name: "Поддержка",
		route: AppRoutes.chats,
		icon: <Icon name='support' width={32} height={32} />,
	},
]

const Sidebar: React.FC = () => {
	const navigation = useAppNavigate()
	const location = useLocation()
	const [hidden, setHidden] = useState(false)
	const { setIsAdmin } = useActions()
	const [logoutRequest] = useLogoutMutation()

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
					<Icon name='arrow-expand-left' width={32} height={32} />
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
				<Button
					className={styles.logoutBtn}
					onClick={async () => {
						try {
							await logoutRequest().unwrap()
						} catch {
							// ignore network errors on logout
						} finally {
							clearAuthToken()
							setIsAdmin(false)
						}
					}}
				>
					<span>Выйти</span>

					<Icon name='logout' width={32} height={32} />
				</Button>
			</div>
		</aside>
	)
}

export default Sidebar
