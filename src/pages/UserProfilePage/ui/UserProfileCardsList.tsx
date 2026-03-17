import React, { useMemo } from "react"
import styles from "./UserProfileCards.module.scss"
import Loading from "@shared/Loading/Loading"
import UserProfileCardItem from "./UserProfileCardItem"
import type { UserCard } from "@shared/api/services/cards/types"
import type { LanguageItem } from "@shared/api/services/languages/types"

type Props = {
	cards: UserCard[]
	languageByCode: Record<string, LanguageItem>
	isLoading: boolean
	onEdit: (card: UserCard) => void
	onDelete: (card: UserCard) => void
}

const UserProfileCardsList: React.FC<Props> = ({
	cards,
	languageByCode,
	isLoading,
	onEdit,
	onDelete,
}) => {
	const isEmpty = useMemo(
		() => !isLoading && cards.length === 0,
		[cards.length, isLoading],
	)

	if (isLoading) {
		return (
			<div className={styles.loadingState}>
				<Loading width={24} height={24} />
				<span>Загружаем карточки пользователя...</span>
			</div>
		)
	}

	if (isEmpty) {
		return (
			<div className={styles.empty}>
				<p className={styles.emptyTitle}>Карточки не найдены</p>
				<p className={styles.emptyText}>
					Попробуйте изменить фильтры или создать новую карточку.
				</p>
			</div>
		)
	}

	return (
		<div className={styles.list}>
			{cards.map(card => (
				<UserProfileCardItem
					key={card.id}
					card={card}
					language={languageByCode[card.language]}
					onEdit={onEdit}
					onDelete={onDelete}
				/>
			))}
		</div>
	)
}

export default UserProfileCardsList
