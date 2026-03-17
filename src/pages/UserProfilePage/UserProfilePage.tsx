import React, { useCallback, useMemo, useState } from "react"
import styles from "./UserProfilePage.module.scss"
import UserProfileLanguagesCard from "./ui/UserProfileLanguagesCard"
import { UserProfileInfo } from "./ui/UserProfileInfo"
import { UserProfileGrids } from "./ui/UserProfileGrids"
import UserProfileCards from "./ui/UserProfileCards"
import Button from "@shared/Button/Button"

type ProfileTab = "cards" | "languages"

const UserProfilePage = () => {
	const [activeTab, setActiveTab] = useState<ProfileTab>("cards")

	const tabLabels = useMemo(
		() => ({
			cards: "Карточки пользователя",
			languages: "Языки пользователя",
		}),
		[],
	)

	const tabHandlers = useMemo(
		() => ({
			cards: () => setActiveTab("cards"),
			languages: () => setActiveTab("languages"),
		}),
		[],
	)

	const cardsTabClassName = useMemo(
		() => (activeTab === "cards" ? styles.tabButtonActive : styles.tabButton),
		[activeTab],
	)

	const languagesTabClassName = useMemo(
		() =>
			activeTab === "languages" ? styles.tabButtonActive : styles.tabButton,
		[activeTab],
	)

	const onCardsTabClick = useCallback(() => {
		tabHandlers.cards()
	}, [tabHandlers])

	const onLanguagesTabClick = useCallback(() => {
		tabHandlers.languages()
	}, [tabHandlers])

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<UserProfileInfo />
			</div>

			<UserProfileGrids />

			<div className={styles.tabs}>
				<div className={styles.tabHeader}>
					<Button className={cardsTabClassName} onClick={onCardsTabClick}>
						{tabLabels.cards}
					</Button>

					<Button
						className={languagesTabClassName}
						onClick={onLanguagesTabClick}
					>
						{tabLabels.languages}
					</Button>
				</div>

				<div className={styles.tabContent}>
					{activeTab === "cards" ? <UserProfileCards /> : null}
					{activeTab === "languages" ? <UserProfileLanguagesCard /> : null}
				</div>
			</div>
		</div>
	)
}

export default UserProfilePage
