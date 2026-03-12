import React from "react"
import styles from "./UserProfilePage.module.scss"
import Skeleton from "@shared/Skeleton/Skeleton"

const UserProfilePageSkeleton = () => {
	return (
		<>
			<Skeleton className={styles.avatarSkeleton} circle />
			<div className={styles.titleBlock}>
				<Skeleton className={styles.titleSkeleton} />
				<Skeleton className={styles.subtitleSkeleton} />
			</div>
		</>
	)
}

export default UserProfilePageSkeleton
