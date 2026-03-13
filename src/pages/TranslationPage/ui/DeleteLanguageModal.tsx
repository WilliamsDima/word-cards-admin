import React, { useCallback } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "../TranslationPage.module.scss"
import { useDeleteLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"
import { DirtyMap } from "../TranslationPage"
import { useToast } from "@shared/Toast/useToast"
import type { LanguageItem } from "@shared/api/services/languages/types"

type Props = {
	deleteTarget: LanguageItem | null
	setDeleteTarget: React.Dispatch<React.SetStateAction<LanguageItem | null>>
	setDirtyMap: React.Dispatch<React.SetStateAction<DirtyMap>>
}

const DeleteLanguageModal: React.FC<Props> = ({
	deleteTarget,
	setDeleteTarget,
	setDirtyMap,
}) => {
	const [deleteLanguage, { isLoading: isDeleting }] =
		useDeleteLanguageMutation()
	const toast = useToast()

	const onConfirmDelete = useCallback(async () => {
		if (!deleteTarget) return
		try {
			await deleteLanguage(deleteTarget.id).unwrap()
			setDirtyMap(prev => ({ ...prev, [deleteTarget.code]: false }))
			toast.success("Язык удалён", deleteTarget.name)
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null
			toast.error("Ошибка удаления", serverError || "Не удалось удалить язык")
		} finally {
			setDeleteTarget(null)
		}
	}, [deleteLanguage, deleteTarget, setDeleteTarget, setDirtyMap, toast])

	const onClose = () => {
		setDeleteTarget(null)
	}

	return (
		<Modal
			open={!!deleteTarget}
			onClose={onClose}
			title='Удалить язык?'
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onClose}>
						Отмена
					</Button>
					<Button
						className={styles.dangerBtn}
						onClick={onConfirmDelete}
						disabled={isDeleting}
					>
						{isDeleting ? "Удаление..." : "Удалить"}
					</Button>
				</>
			}
		>
			{"Вы собираетесь удалить "}
			<strong>{deleteTarget?.name || "Без названия"}</strong>
			{". Действие необратимо."}
		</Modal>
	)
}

export default DeleteLanguageModal
