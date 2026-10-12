import React, { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "./UserProfileAchievements.module.scss"
import { useToast } from "@shared/Toast/useToast"
import { useResetUserAchievementMutation } from "@shared/api/services/userAchievements/UserAchievementsQuery"
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

const UserProfileAchievementResetModal: React.FC<Props> = ({
	achievement,
	translations,
	onClose,
}) => {
	const { id } = useParams()

	const [resetUserAchievement, { isLoading }] =
		useResetUserAchievementMutation()
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
			await resetUserAchievement({
				userId: id,
				achievementId: achievement.id,
			}).unwrap()
			toast.success("Достижение сброшено", titleLabel)
			onClose()
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data
					?.error ?? null
			toast.error(
				"Ошибка сброса",
				serverError || "Не удалось сбросить достижение",
			)
		}
	}, [achievement, id, onClose, resetUserAchievement, titleLabel, toast])

	return (
		<Modal
			open={Boolean(achievement)}
			onClose={onCloseModal}
			title='Сбросить достижение?'
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onCloseModal}>
						Отмена
					</Button>
					<Button
						className={styles.dangerBtn}
						onClick={onConfirmReset}
						disabled={isLoading}
					>
						{isLoading ? "Сброс..." : "Сбросить"}
					</Button>
				</>
			}
		>
			<p className={styles.modalText}>
				{"Будет снята разблокировка достижения "}
				<strong>{titleLabel}</strong>
				{" у этого пользователя."}
			</p>
			<p className={styles.modalWarning}>
				Достижения вычисляются на лету по текущим метрикам пользователя (карточки,
				стрики и т.д.), а не по логу событий. Сброс лишь снимает флаг
				разблокировки: если метрика всё ещё соответствует порогу получения
				достижения, оно тут же разблокируется заново с новой датой при
				следующем обращении мобильного приложения к списку достижений.
			</p>
		</Modal>
	)
}

export default UserProfileAchievementResetModal
