import React, { ReactNode, useCallback, useState } from "react"
import styles from "./UserProfilePage.module.scss"
import UserProfileLanguagesCard from "./ui/UserProfileLanguagesCard"
import { UserProfileInfo } from "./ui/UserProfileInfo"
import { UserProfileGrids } from "./ui/UserProfileGrids"
import UserProfileCards from "./ui/UserProfileCards"
import UserProfileStats from "./ui/UserProfileStats"
import UserProfileAchievements from "./ui/UserProfileAchievements"
import Button from "@shared/Button/Button"
import cn from "classnames"

type ProfileTab = "cards" | "languages" | "stats" | "achievements"

const tabs: Record<ProfileTab, { label: string; component: ReactNode }> = {
	cards: {
		label: "Карточки пользователя",
		component: <UserProfileCards />,
	},
	languages: {
		label: "Языки пользователя",
		component: <UserProfileLanguagesCard />,
	},
	stats: {
		label: "Статистика пользователя",
		component: <UserProfileStats />,
	},
	achievements: {
		label: "Достижения",
		component: <UserProfileAchievements />,
	},
}

const tabLabels = Object.keys(tabs) as [ProfileTab]

const UserProfilePage = () => {
	const [activeTab, setActiveTab] = useState<ProfileTab>("cards")

	const onTabClick = useCallback((tab: ProfileTab) => {
		setActiveTab(tab)
	}, [])

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<UserProfileInfo />
			</div>

			<UserProfileGrids />

			<div className={styles.tabs}>
				<div className={styles.tabHeader}>
					{tabLabels.map(tab => (
						<Button
							key={tab}
							className={cn(styles.tabButton, {
								[styles.tabButtonActive]: activeTab === tab,
							})}
							onClick={onTabClick.bind(null, tab)}
						>
							{tabs[tab].label}
						</Button>
					))}
				</div>

				<div className={styles.tabContent}>{tabs[activeTab].component}</div>
			</div>
		</div>
	)
}

export default UserProfilePage
