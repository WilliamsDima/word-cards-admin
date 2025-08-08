// Sidebar.tsx
import React from "react"
import styles from "./Sidebar.module.scss"
import { logout } from "@shared/config/firebase"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import { AppRoutes } from "@app/navigation/routes"

const Sidebar: React.FC = () => {
	const navigation = useAppNavigate()
	return (
		<aside className={styles.sidebar}>
			<div className={styles.header}>
				<div
					className={styles.adminName}
					onClick={() => navigation(AppRoutes.main)}
				>
					Admins
				</div>
			</div>
			<nav className={styles.nav}>
				<button
					className={styles.navItem}
					onClick={() => navigation(AppRoutes.users)}
				>
					Пользователи
				</button>
				<button
					className={styles.navItem}
					onClick={() => navigation(AppRoutes.aplication)}
				>
					Приложение
				</button>
				<button
					className={styles.navItem}
					onClick={() => navigation(AppRoutes.chats)}
				>
					Поддержка
				</button>
			</nav>
			<div className={styles.footer}>
				<button className={styles.logoutBtn} onClick={logout}>
					Выйти
				</button>
			</div>
		</aside>
	)
}

export default Sidebar
