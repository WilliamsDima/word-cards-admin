import React, { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "./UserProfileAchievements.module.scss"
import { useToast } from "@shared/Toast/useToast"
import { useResetUserAchievementSeenMutation } from "@shared/api/services/userAchievements/UserAchievementsQuery"
import type { UserAchievement } from "@shared/api/services/userAchievements/types"
import {
	resolveTranslationText,
	type TranslationDictionary,
} from "@shared/lib/translationPreview"

type Props = {
	achievement: UserAchievement | null
	translations: TranslationDictionary | null
	onClose: () => void
}

const UserProfileAchievementSeenResetModal: React.FC<Props> = ({
	achievement,
	translations,
	onClose,
}) => {
	const { id } = useParams()

	const [resetUserAchievementSeen, { isLoading }] =
		useResetUserAchievementSeenMutation()
	const toast = useToast()

	const titleLabel = useMemo(
		() =>
			resolveTranslationText(
				translations,
				achievement?.title,
				achievement?.threshold,
			) ?? "Без названия",
		[achievement, translations],
	)

	const onCloseModal = useCallback(() => onClose(), [onClose])

	const onConfirmReset = useCallback(async () => {
		if (!achievement || !id) return
		try {
			await resetUserAchievementSeen({
				userId: id,
				achievementId: achievement.id,
			}).unwrap()
			toast.success("Просмотр сброшен", titleLabel)
			onClose()
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data
					?.error ?? null
			toast.error(
				"Ошибка сброса просмотра",
				serverError || "Не удалось сбросить просмотр достижения",
			)
		}
	}, [achievement, id, onClose, resetUserAchievementSeen, titleLabel, toast])

	return (
		<Modal
			open={Boolean(achievement)}
			onClose={onCloseModal}
			title='Сбросить просмотр достижения?'
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onCloseModal}>
						Отмена
					</Button>
					<Button
						className={styles.warningBtn}
						onClick={onConfirmReset}
						disabled={isLoading}
					>
						{isLoading ? "Сброс..." : "Сбросить просмотр"}
					</Button>
				</>
			}
		>
			<p className={styles.modalText}>
				{"Пользователь снова увидит достижение "}
				<strong>{titleLabel}</strong>
				{" в мобильном приложении, как будто только что его получил."}
			</p>
			<p className={styles.modalHint}>
				Сбрасывается только факт показа. Разблокировка, её дата и статистика
				пользователя не меняются.
			</p>
		</Modal>
	)
}

export default UserProfileAchievementSeenResetModal
