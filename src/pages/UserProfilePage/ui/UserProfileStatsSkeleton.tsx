import React from "react"
import styles from "./UserProfileStats.module.scss"
import Skeleton from "@shared/Skeleton/Skeleton"

const UserProfileStatsSkeleton = () => {
	return (
		<div className={styles.statsSkeleton}>
			<Skeleton className={styles.skeletonTile} />
			<Skeleton className={styles.skeletonTile} />
			<Skeleton className={styles.skeletonTile} />
			<Skeleton className={styles.skeletonTile} />
			<Skeleton className={styles.skeletonTile} />
			<Skeleton className={styles.skeletonTile} />
		</div>
	)
}

export default UserProfileStatsSkeleton
