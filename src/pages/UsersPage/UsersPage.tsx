import { UsersList } from "@features/Users/ui/UsersList/UsersList"
import UsersListFilter from "@widgets/UsersListFilter/UsersListFilter"
import React from "react"
import styles from "./UsersPage.module.scss"

function UsersPage() {
	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<h1 className={styles.title}>Пользователи</h1>
				<p className={styles.subtitle}>
					Управление профилями, активностью и доступом.
				</p>
			</div>
			<div className={styles.toolbar}>
				<UsersListFilter />
			</div>
			<div className={styles.panel}>
				<UsersList />
			</div>
		</div>
	)
}

export default UsersPage
