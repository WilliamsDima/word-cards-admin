import React, { useCallback, useMemo } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "./UserProfileCards.module.scss"
import { useToast } from "@shared/Toast/useToast"
import { useDeleteUserCardMutation } from "@shared/api/services/cards/CardsQuery"
import type { UserCard } from "@shared/api/services/cards/types"
import { useParams } from "react-router-dom"

type Props = {
	open: boolean
	card: UserCard | null
	onClose: () => void
}

const UserProfileCardDeleteModal: React.FC<Props> = ({
	open,
	card,
	onClose,
}) => {
	const { id } = useParams()

	const [deleteCard, { isLoading }] = useDeleteUserCardMutation()
	const toast = useToast()

	const descriptionLabel = useMemo(() => {
		if (!card) return ""
		return card.description?.trim().length ? card.description : card.language
	}, [card])

	const onCloseModal = useCallback(() => {
		onClose()
	}, [onClose])

	const onConfirmDelete = useCallback(async () => {
		if (!card || !id) return
		try {
			await deleteCard({ userId: id, cardId: card.id }).unwrap()
			toast.success("Карточка удалена", descriptionLabel || "Без описания")
			onClose()
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null
			toast.error(
				"Ошибка удаления",
				serverError || "Не удалось удалить карточку",
			)
		}
	}, [card, deleteCard, descriptionLabel, onClose, toast, id])

	return (
		<Modal
			open={open}
			onClose={onCloseModal}
			title='Удалить карточку?'
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
						Удалить
					</Button>
				</>
			}
		>
			Вы собираетесь удалить карточку{" "}
			<strong>{descriptionLabel || "Без описания"}</strong>. Действие
			необратимо.
		</Modal>
	)
}

export default UserProfileCardDeleteModal
