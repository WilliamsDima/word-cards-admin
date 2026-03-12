import React from "react"
import styles from "./UsersList.module.scss"
import { UserItem } from "../UserItem/UserItem"
import { useGetUsersQuery } from "@entities/api/users/UsersQuery"
import Skeleton from "@shared/Skeleton/Skeleton"

export const UsersList = () => {
	const { data, isLoading } = useGetUsersQuery()
	const skeletonItems = Array.from({ length: 6 })

	return (
		<div className={styles.content}>
			<p className={styles.count}>
				{isLoading ? (
					<Skeleton width={120} height={16} />
				) : (
					<>Найдено: {data?.length || 0}</>
				)}
			</p>
			<div className={styles.listWrapper}>
				{isLoading ? (
					<ul className={styles.list}>
						{skeletonItems.map((_, i) => (
							<li className={styles.skeletonItem} key={i}>
								<Skeleton className={styles.skeletonAvatar} circle />
								<div className={styles.skeletonInfo}>
									<Skeleton className={styles.skeletonLine} />
									<Skeleton className={styles.skeletonLineShort} />
									<Skeleton className={styles.skeletonLine} />
								</div>
							</li>
						))}
					</ul>
				) : data ? (
					<ul className={styles.list}>
						{data?.map(user => (
							<UserItem key={user.id} user={user} />
						))}
					</ul>
				) : (
					<></>
				)}
			</div>
		</div>
	)
}
