import React from "react"
import styles from "./UserProfilePage.module.scss"
import UserProfileLanguagesCard from "./ui/UserProfileLanguagesCard"
import { UserProfileInfo } from "./ui/UserProfileInfo"
import { UserProfileGrids } from "./ui/UserProfileGrids"

const UserProfilePage = () => {
	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<UserProfileInfo />
			</div>

			<UserProfileGrids />

			<UserProfileLanguagesCard />
		</div>
	)
}

export default UserProfilePage
