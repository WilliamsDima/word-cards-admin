import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileAchievements.module.scss"
import Card from "@shared/Card/Card"
import Tooltip from "@shared/Tooltip/Tooltip"
import { useGetUserAchievementsQuery } from "@shared/api/services/userAchievements/UserAchievementsQuery"
import type { UserAchievement } from "@shared/api/services/userAchievements/types"
import UserProfileAchievementItem from "./UserProfileAchievementItem"
import UserProfileAchievementResetModal from "./UserProfileAchievementResetModal"

const UserProfileAchievements: React.FC = () => {
	const { id } = useParams()

	const [resetTarget, setResetTarget] = useState<UserAchievement | null>(null)

	const { data, isLoading, isFetching } = useGetUserAchievementsQuery(
		id ?? "",
		{ skip: !id },
	)

	const achievements = useMemo(() => data?.items ?? [], [data])

	const isListLoading = useMemo(
		() => isLoading || isFetching,
		[isFetching, isLoading],
	)

	const isEmpty = useMemo(
		() => !isListLoading && achievements.length === 0,
		[achievements.length, isListLoading],
	)

	const onOpenReset = useCallback((achievement: UserAchievement) => {
		setResetTarget(achievement)
	}, [])

	const onCloseReset = useCallback(() => {
		setResetTarget(null)
	}, [])

	return (
		<Card className={styles.achievementsCard}>
			<div className={styles.header}>
				<div className={styles.headerText}>
					<span className={styles.titleRow}>
						<h2 className={styles.title}>Достижения пользователя</h2>
						<Tooltip>
							Достижения вычисляются на лету по текущим метрикам пользователя,
							а не по логу событий. Сброс лишь снимает флаг разблокировки:
							если условия всё ещё выполняются, достижение тут же
							разблокируется заново (с новой датой) при следующем обращении
							мобильного приложения к списку достижений.
						</Tooltip>
					</span>
					<p className={styles.hint}>
						Каталог достижений с прогрессом этого пользователя. Кнопка
						«Сбросить» доступна только для уже разблокированных достижений.
					</p>
				</div>
			</div>

			{isListLoading && !data ? (
				<div className={styles.loadingState}>Загружаем достижения...</div>
			) : (
				<></>
			)}

			{isEmpty ? (
				<div className={styles.empty}>
					<span className={styles.emptyTitle}>Нет достижений</span>
					<span className={styles.emptyText}>
						В каталоге пока нет активных достижений.
					</span>
				</div>
			) : (
				<></>
			)}

			{!isEmpty ? (
				<div className={styles.list}>
					{achievements.map(achievement => (
						<UserProfileAchievementItem
							key={achievement.id}
							achievement={achievement}
							onReset={onOpenReset}
						/>
					))}
				</div>
			) : (
				<></>
			)}

			<UserProfileAchievementResetModal
				achievement={resetTarget}
				onClose={onCloseReset}
			/>
		</Card>
	)
}

export default UserProfileAchievements
