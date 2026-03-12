import React from "react"
import styles from "./UserProfilePage.module.scss"
import Skeleton from "@shared/Skeleton/Skeleton"

const UserProfilePageGridsSkeleton = () => {
	return (
		<>
			{Array.from({ length: 3 }).map((_, i) => (
				<div className={styles.card} key={i}>
					<Skeleton className={styles.cardTitleSkeleton} />
					<Skeleton className={styles.rowSkeleton} />
					<Skeleton className={styles.rowSkeletonShort} />
					<Skeleton className={styles.rowSkeleton} />
				</div>
			))}
		</>
	)
}

export default UserProfilePageGridsSkeleton
