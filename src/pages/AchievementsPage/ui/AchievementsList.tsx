import React, { useMemo } from "react"
import styles from "../AchievementsPage.module.scss"
import AchievementItem from "./AchievementItem"
import type { Achievement } from "@shared/api/services/achievements/types"

type Props = {
	achievements: Achievement[]
	onEdit: (achievement: Achievement) => void
	onDelete: (achievement: Achievement) => void
}

const AchievementsList: React.FC<Props> = ({
	achievements,
	onEdit,
	onDelete,
}) => {
	const isEmpty = useMemo(
		() => achievements.length === 0,
		[achievements.length],
	)

	return (
		<div className={styles.listWrapper}>
			{isEmpty ? (
				<div className={styles.empty}>
					<span className={styles.emptyTitle}>Нет достижений</span>
					<span className={styles.emptyText}>
						Добавьте первое достижение, чтобы начать работу.
					</span>
				</div>
			) : (
				<div className={styles.list}>
					<div className={styles.listHead}>
						<span>Иконка</span>
						<span>Код</span>
						<span>Название</span>
						<span>Метрика</span>
						<span>Порог</span>
						<span>Сортировка</span>
						<span>Статус</span>
						<span>Действия</span>
					</div>
					{achievements.map(achievement => (
						<AchievementItem
							key={achievement.id}
							achievement={achievement}
							onEdit={onEdit}
							onDelete={onDelete}
						/>
					))}
				</div>
			)}
		</div>
	)
}

export default AchievementsList
