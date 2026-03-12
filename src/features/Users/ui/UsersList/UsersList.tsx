import React from "react"
import styles from "./UsersList.module.scss"
import { UserItem } from "../UserItem/UserItem"
import { useGetUsersQuery } from "@entities/api/users/UsersQuery"
import Skeleton from "@shared/Skeleton/Skeleton"
import { UsersListSkeleton } from "./UsersListSkeleton"
import { Icon } from "@assets/icons/Icon"

export const UsersList = () => {
	const { data, isLoading } = useGetUsersQuery()

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
					<UsersListSkeleton />
				) : data && data.length > 0 ? (
					<ul className={styles.list}>
						{data?.map(user => (
							<UserItem key={user.id} user={user} />
						))}
					</ul>
				) : (
					<div className={styles.empty}>
						<span className={styles.emptyIcon}>
							<Icon kind='svg' name='user' width={28} height={28} />
						</span>
						<p className={styles.emptyTitle}>Пользователи не найдены</p>
						<p className={styles.emptyText}>
							Проверьте фильтры или попробуйте обновить список.
						</p>
					</div>
				)}
			</div>
		</div>
	)
}
