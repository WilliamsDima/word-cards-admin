import React, { FC } from "react"
import styles from "./UsersListFilter.module.scss"
import cn from "classnames"
import Search from "@shared/Search/Search"

const UsersListFilter: FC = () => {
	return (
		<div className={styles.usersFilter}>
			<Search
				className={styles.input}
				classnames={{ inputWrapper: styles.inputWrapper }}
			/>
		</div>
	)
}

export default UsersListFilter
