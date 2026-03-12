import React, { FC, memo } from "react"
import styles from "../UserProfilePage.module.scss"

type ProfileGridItemRowType = {
	label: string
	value: string | number | undefined
}

export type ProfileGridItemType = {
	title: string
	rows: ProfileGridItemRowType[]
}

type UserProfileGridItemProps = {
	item: ProfileGridItemType
}

const UserProfileGridItem: FC<UserProfileGridItemProps> = memo(({ item }) => {
	return (
		<div className={styles.card}>
			<h3 className={styles.cardTitle}>Account</h3>

			{item.rows.map((it, i) => (
				<div className={styles.row} key={i}>
					<span className={styles.label}>{it.label}</span>
					<span className={styles.value}>{it.value ?? "N/A"}</span>
				</div>
			))}
		</div>
	)
})

export default UserProfileGridItem
