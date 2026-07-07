import React, { useCallback, useMemo, useState } from "react"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"
import Badge from "@shared/Badge/Badge"
import Button from "@shared/Button/Button"
import Loading from "@shared/Loading/Loading"
import styles from "./AchievementsPage.module.scss"
import { useGetAchievementsQuery } from "@shared/api/services/achievements/AchievementsQuery"
import type { Achievement } from "@shared/api/services/achievements/types"
import AchievementsList from "./ui/AchievementsList"
import AchievementModal from "./ui/AchievementModal"
import AchievementDeleteModal from "./ui/AchievementDeleteModal"

function AchievementsPage() {
	const { data, isLoading, isError } = useGetAchievementsQuery()

	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [editTarget, setEditTarget] = useState<Achievement | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<Achievement | null>(null)

	const achievements = useMemo(() => {
		const items = data?.items ?? []
		return [...items].sort(
			(a, b) => a.sort_order - b.sort_order || a.title.localeCompare(b.title),
		)
	}, [data])

	const achievementsCount = useMemo(() => achievements.length, [achievements])

	const isModalOpen = useMemo(
		() => isCreateOpen || Boolean(editTarget),
		[editTarget, isCreateOpen],
	)

	const onOpenCreate = useCallback(() => setIsCreateOpen(true), [])

	const onOpenEdit = useCallback((achievement: Achievement) => {
		setEditTarget(achievement)
	}, [])

	const onOpenDelete = useCallback((achievement: Achievement) => {
		setDeleteTarget(achievement)
	}, [])

	const onCloseModal = useCallback(() => {
		setIsCreateOpen(false)
		setEditTarget(null)
	}, [])

	const onCloseDelete = useCallback(() => setDeleteTarget(null), [])

	return (
		<div className={styles.page}>
			<PageHeader
				title='Достижения'
				subtitle='Справочник достижений мобильного приложения.'
			/>

			<Card className={styles.card}>
				<div className={styles.listHeader}>
					<div>
						<div className={styles.sectionTitleRow}>
							<h2 className={styles.sectionTitle}>Список достижений</h2>
							<Badge label={`Всего: ${achievementsCount}`} variant='info' />
						</div>
						<p className={styles.sectionHint}>
							Управляйте достижениями, которые пользователи открывают в
							мобильном приложении.
						</p>
					</div>
					<Button className={styles.addBtn} onClick={onOpenCreate}>
						Добавить достижение
					</Button>
				</div>

				{isLoading ? (
					<div className={styles.loadingState}>
						<Loading className={styles.loadingSpinner} />
						<span>Загружаем достижения...</span>
					</div>
				) : (
					<></>
				)}

				{isError && !isLoading ? (
					<div className={styles.empty}>
						<span className={styles.emptyTitle}>
							Не удалось загрузить достижения
						</span>
						<span className={styles.emptyText}>
							Проверьте подключение и повторите позже.
						</span>
					</div>
				) : (
					<></>
				)}

				{!isLoading && !isError ? (
					<AchievementsList
						achievements={achievements}
						onEdit={onOpenEdit}
						onDelete={onOpenDelete}
					/>
				) : (
					<></>
				)}
			</Card>

			<AchievementModal
				open={isModalOpen}
				achievement={editTarget}
				onClose={onCloseModal}
			/>

			<AchievementDeleteModal
				achievement={deleteTarget}
				onClose={onCloseDelete}
			/>
		</div>
	)
}

export default AchievementsPage
