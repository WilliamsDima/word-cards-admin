import React, { useMemo } from "react"
import { useLocation, useParams } from "react-router-dom"
import styles from "../UserProfilePage.module.scss"
import type { IUser } from "@entities/api/users/types"
import { useGetUserByIdQuery } from "@entities/api/users/UsersQuery"
import UserProfilePageSkeleton from "../UserProfilePageSkeleton"

export const UserProfileInfo = () => {
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

	const showSkeleton = useMemo(() => isLoading && !user, [isLoading, user])

	return showSkeleton ? (
		<UserProfilePageSkeleton />
	) : (
		<>
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
		</>
	)
}
