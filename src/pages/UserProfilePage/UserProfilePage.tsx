import React, { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import styles from "./UserProfilePage.module.scss"
import type { IUser } from "@entities/api/users/types"
import { useGetUserByIdQuery } from "@entities/api/users/UsersQuery"

function UserProfilePage() {
	const { id } = useParams()
	const location = useLocation()
	const userFromState = (location.state as { user?: IUser } | undefined)?.user
	const { data, isLoading } = useGetUserByIdQuery(id ?? "", {
		skip: !id,
	})
	const user: IUser | undefined = useMemo(
		() => data ?? userFromState,
		[data, userFromState],
	)

	const createdAt = useMemo(
		() =>
			user?.created_at
				? new Intl.DateTimeFormat("ru-RU", { dateStyle: "medium" }).format(
						new Date(user.created_at),
					)
				: "N/A",
		[user],
	)

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<div className={styles.avatar}>
					{user?.image ? (
						<img src={user.image} alt={user.name || "N/A"} />
					) : (
						<span>{user?.name?.charAt(0).toUpperCase() ?? "N/A"}</span>
					)}
				</div>
				<div className={styles.titleBlock}>
					<h1 className={styles.title}>{user?.name ?? "N/A"}</h1>
					<p className={styles.subtitle}>
						{isLoading ? "Loading profile data..." : "User profile overview"}
					</p>
					<span className={styles.idBadge}>ID {user?.id ?? id ?? "N/A"}</span>
				</div>
			</div>

			<div className={styles.grid}>
				<div className={styles.card}>
					<h3 className={styles.cardTitle}>Account</h3>
					<div className={styles.row}>
						<span className={styles.label}>Email</span>
						<span className={styles.value}>{user?.email ?? "N/A"}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Auth provider</span>
						<span className={styles.value}>
							{user?.email ? "Google" : "Vk"}
						</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>UID</span>
						<span className={styles.value}>{user?.google_uid ?? "N/A"}</span>
					</div>
				</div>

				<div className={styles.card}>
					<h3 className={styles.cardTitle}>Activity</h3>
					<div className={styles.row}>
						<span className={styles.label}>Registered</span>
						<span className={styles.value}>{createdAt}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Last active</span>
						<span className={styles.value}>N/A</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Status</span>
						<span className={styles.value}>Active</span>
					</div>
				</div>

				<div className={styles.card}>
					<h3 className={styles.cardTitle}>Profile</h3>
					<div className={styles.row}>
						<span className={styles.label}>User id</span>
						<span className={styles.value}>{user?.id ?? id ?? "N/A"}</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Avatar</span>
						<span className={styles.value}>
							{user?.image ? "Set" : "Not set"}
						</span>
					</div>
					<div className={styles.row}>
						<span className={styles.label}>Notes</span>
						<span className={styles.value}>N/A</span>
					</div>
				</div>
			</div>
		</div>
	)
}

export default UserProfilePage
