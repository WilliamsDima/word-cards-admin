import React, { FC, useCallback } from "react"
import styles from "../SocialsPage.module.scss"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import type { ISocial } from "@shared/api/services/appConfig/types"
import type { ToastContextValue } from "@shared/Toast/types"

type SocialDeleteModalProps = {
	deleteTarget: ISocial | null
	socialsData: ISocial[]
	setDeleteTarget: (deleteTarget: ISocial | null) => void
	setSocialsData: (socialsData: ISocial[]) => void
	persist: (
		nextSocials: ISocial[],
		id?: number | string,
	) => Promise<{ ok: true } | { ok: false; err: unknown } | undefined>
	toast: ToastContextValue
}

export const SocialDeleteModal: FC<SocialDeleteModalProps> = ({
	deleteTarget,
	socialsData,
	setDeleteTarget,
	setSocialsData,
	persist,
	toast,
}) => {
	const onClose = () => setDeleteTarget(null)

	const confirmDelete = useCallback(async () => {
		if (!deleteTarget) return
		const next = socialsData.filter(it => it.id !== deleteTarget.id)
		setSocialsData(next)
		setDeleteTarget(null)
		const result = await persist(next, deleteTarget.id)
		if (result?.ok) {
			toast.success("Соцсеть удалена", deleteTarget.name || "Без названия")
		} else if (result && !result.ok) {
			const serverError =
				(result.err as { data?: { data?: { error?: string } } })?.data?.data
					?.error ?? null
			toast.error(
				"Ошибка удаления",
				serverError || "Не удалось удалить соцсеть",
			)
		}
	}, [
		deleteTarget,
		persist,
		socialsData,
		setDeleteTarget,
		setSocialsData,
		toast,
	])

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
