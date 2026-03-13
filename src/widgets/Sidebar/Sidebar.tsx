import React, { useMemo, useState } from "react"
import styles from "./Sidebar.module.scss"
import {
	useLogoutMutation,
	useMeQuery,
} from "@shared/api/services/auth/AuthQuery"
import { clearAuthToken, getAuthToken } from "@shared/lib/authToken"
import { useActions } from "@shared/hooks/useActions"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import { AppRoutes } from "@app/navigation/routes"
import { useLocation } from "react-router-dom"
import cn from "classnames"
import Button from "@shared/Button/Button"
import { Icon } from "@assets/icons/Icon"
import Skeleton from "@shared/Skeleton/Skeleton"

const routesNav = [
	{
		name: "Пользователи",
		route: AppRoutes.users,
		icon: <Icon kind='svg' name='user' width={20} height={20} />,
	},
	{
		name: "Приложение",
		route: AppRoutes.aplication,
		icon: <Icon kind='svg' name='app' width={20} height={20} />,
	},
	{
		name: "Соц. сети",
		route: AppRoutes.socials,
		icon: <Icon kind='svg' name='links' width={20} height={20} />,
	},
	{
		name: "Поддержка",
		route: AppRoutes.chats,
		icon: <Icon kind='svg' name='support' width={20} height={20} />,
	},
]
const Sidebar: React.FC = () => {
	const navigation = useAppNavigate()
	const location = useLocation()
	const [hidden, setHidden] = useState(false)
	const { setIsAdmin } = useActions()
	const [logoutRequest] = useLogoutMutation()
	const token = getAuthToken()
	const { data, isLoading } = useMeQuery(undefined, { skip: !token })

	const displayName = useMemo(
		() => data?.name || data?.email || "Current user",
		[data],
	)

	const currentRoute = useMemo(() => {
		return location?.pathname
	}, [location])

	const toMain = () => navigation(AppRoutes.main)
	const toggleShow = () => setHidden(prev => !prev)
	const toProfile = () =>
		data?.id ? navigation(AppRoutes.userProfile, { id: data.id }) : null

	const onLogout = async () => {
		try {
			await logoutRequest().unwrap()
		} catch {
			// ignore network errors on logout
		} finally {
			clearAuthToken()
			setIsAdmin(false)
		}
	}

	const sidebarStyles = useMemo(
		() =>
			cn(styles.sidebar, {
				[styles.hidden]: hidden,
			}),
		[hidden],
	)

	return (
		<aside className={sidebarStyles}>
			<div className={styles.header}>
				<div className={styles.title} onClick={toMain}>
					<span className={styles.brandMark}>WC</span>
					{!hidden && <span className={styles.brandText}>Word Cards</span>}
				</div>

				<button className={styles.arrow} onClick={toggleShow}>
					<Icon kind='svg' name='arrow-expand-left' width={20} height={20} />
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
			<button className={styles.currentUser} onClick={toProfile} type='button'>
				<span className={styles.currentAvatar}>
					{isLoading ? (
						<Skeleton className={styles.currentAvatarSkeleton} circle />
					) : data?.picture ? (
						<img src={data.picture} alt={displayName} />
					) : (
						<span>{displayName.charAt(0).toUpperCase()}</span>
					)}
				</span>
				{!hidden && (
					<span className={styles.currentMeta}>
						{isLoading ? (
							<>
								<Skeleton className={styles.currentNameSkeleton} />
								<Skeleton className={styles.currentSubSkeleton} />
							</>
						) : (
							<>
								<span className={styles.currentName}>{displayName}</span>
								<span className={styles.currentSub}>View profile</span>
							</>
						)}
					</span>
				)}
			</button>
			<div className={styles.footer}>
				<Button className={styles.logoutBtn} onClick={onLogout}>
					<span>Выйти</span>

					<Icon kind='svg' name='logout' width={20} height={20} />
				</Button>
			</div>
		</aside>
	)
}

export default Sidebar
