import React from "react"
import styles from "./UsersList.module.scss"
import Skeleton from "@shared/Skeleton/Skeleton"

const skeletonItems = Array.from({ length: 6 })

export const UsersListSkeleton = () => {
	return (
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
	)
}
