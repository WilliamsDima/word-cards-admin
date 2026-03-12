import React, { FC, ChangeEvent } from "react"
import styles from "./UsersListFilter.module.scss"
import Search from "@shared/Search/Search"

type Props = {
	value: string
	onChange: (value: string) => void
}

const UsersListFilter: FC<Props> = ({ value, onChange }) => {
	const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
		onChange(event.target.value)
	}

	return (
		<div className={styles.usersFilter}>
			<Search
				value={value}
				onChange={handleChange}
				className={styles.input}
				classnames={{ inputWrapper: styles.inputWrapper }}
				placeholder='Search users...'
			/>
		</div>
	)
}

export default UsersListFilter
