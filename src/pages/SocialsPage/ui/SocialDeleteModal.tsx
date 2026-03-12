import React, { FC, useCallback } from "react"
import styles from "../SocialsPage.module.scss"
import type { ISocial } from "@shared/api/types"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"

type SocialDeleteModalProps = {
	deleteTarget: ISocial | null
	socialsData: ISocial[]
	setDeleteTarget: (deleteTarget: ISocial | null) => void
	setSocialsData: (socialsData: ISocial[]) => void
	persist: (nextSocials: ISocial[], id?: number | string) => Promise<void>
}

export const SocialDeleteModal: FC<SocialDeleteModalProps> = ({
	deleteTarget,
	socialsData,
	setDeleteTarget,
	setSocialsData,
	persist,
}) => {
	const onClose = () => setDeleteTarget(null)

	const confirmDelete = useCallback(async () => {
		if (!deleteTarget) return
		const next = socialsData.filter(it => it.id !== deleteTarget.id)
		setSocialsData(next)
		setDeleteTarget(null)
		await persist(next, deleteTarget.id)
	}, [deleteTarget, persist, socialsData, setDeleteTarget, setSocialsData])

	return (
		<Modal
			open={Boolean(deleteTarget)}
			onClose={onClose}
			title='Удалить соцсеть?'
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onClose}>
						Отмена
					</Button>
					<Button className={styles.dangerBtn} onClick={confirmDelete}>
						Удалить
					</Button>
				</>
			}
		>
			Вы собираетесь удалить
			<strong> {deleteTarget?.name || "Без названия"}</strong>. Действие
			необратимо.
		</Modal>
	)
}
