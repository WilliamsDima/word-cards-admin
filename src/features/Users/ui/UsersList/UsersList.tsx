import React from "react"
import styles from "./UsersList.module.scss"
import { UserItem } from "../UserItem/UserItem"
import Loading from "@shared/Loading/Loading"
import { useGetUsersQuery } from "@entities/api/users/UsersQuery"

export const UsersList = () => {
	const { data, isLoading } = useGetUsersQuery()

	return (
		<div className={styles.content}>
			<p className={styles.count}>Найдено: {data?.length || 0}</p>
			<div className={styles.listWrapper}>
				{isLoading && <Loading />}
				{data ? (
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
