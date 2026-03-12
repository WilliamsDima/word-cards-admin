import React, { FC, memo } from "react"
import styles from "../UserProfilePage.module.scss"
import Card from "@shared/Card/Card"

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
		<Card className={styles.card}>
			<h3 className={styles.cardTitle}>{item.title}</h3>

			{item.rows.map((it, i) => (
				<div className={styles.row} key={i}>
					<span className={styles.label}>{it.label}</span>
					<span className={styles.value}>{it.value ?? "N/A"}</span>
				</div>
			))}
		</Card>
	)
})

export default UserProfileGridItem
