import React from "react"
import styles from "./UserProfilePage.module.scss"
import Skeleton from "@shared/Skeleton/Skeleton"
import Card from "@shared/Card/Card"

const UserProfilePageGridsSkeleton = () => {
	return (
		<>
			{Array.from({ length: 3 }).map((_, i) => (
				<Card className={styles.card} key={i}>
					<Skeleton className={styles.cardTitleSkeleton} />
					<Skeleton className={styles.rowSkeleton} />
					<Skeleton className={styles.rowSkeletonShort} />
					<Skeleton className={styles.rowSkeleton} />
				</Card>
			))}
		</>
	)
}

export default UserProfilePageGridsSkeleton
