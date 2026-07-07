import React, { useCallback, useMemo } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "../AchievementsPage.module.scss"
import { useToast } from "@shared/Toast/useToast"
import { useDeleteAchievementMutation } from "@shared/api/services/achievements/AchievementsQuery"
import type { Achievement } from "@shared/api/services/achievements/types"

type Props = {
	achievement: Achievement | null
	onClose: () => void
}

const AchievementDeleteModal: React.FC<Props> = ({ achievement, onClose }) => {
	const [deleteAchievement, { isLoading }] = useDeleteAchievementMutation()
	const toast = useToast()

	const titleLabel = useMemo(
		() => achievement?.title || "Без названия",
		[achievement],
	)

	const onCloseModal = useCallback(() => onClose(), [onClose])

	const onConfirmDelete = useCallback(async () => {
		if (!achievement) return
		try {
			await deleteAchievement(achievement.id).unwrap()
			toast.success("Достижение удалено", achievement.title)
			onClose()
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data
					?.error ?? null
			toast.error(
				"Ошибка удаления",
				serverError || "Не удалось удалить достижение",
			)
		}
	}, [achievement, deleteAchievement, onClose, toast])

	return (
		<Modal
			open={Boolean(achievement)}
			onClose={onCloseModal}
			title='Удалить достижение?'
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onCloseModal}>
						Отмена
					</Button>
					<Button
						className={styles.dangerBtn}
						onClick={onConfirmDelete}
						disabled={isLoading}
					>
						{isLoading ? "Удаление..." : "Удалить"}
					</Button>
				</>
			}
		>
			{"Вы собираетесь удалить достижение "}
			<strong>{titleLabel}</strong>
			{
				". Это также удалит разблокировки этого достижения у всех пользователей. Действие необратимо."
			}
		</Modal>
	)
}

export default AchievementDeleteModal
