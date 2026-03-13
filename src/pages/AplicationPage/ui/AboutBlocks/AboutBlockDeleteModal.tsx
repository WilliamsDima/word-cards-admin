import React, { memo, useCallback, useMemo } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import type { IAplication, IBlock } from "@shared/api/services/appConfig/types"
import styles from "./AboutBlocks.module.scss"
import { useToast } from "@shared/Toast/useToast"
import { useUpdateAppConfigMutation } from "@shared/api/services/appConfig/AppConfigQuery"

type Props = {
	open: boolean
	deleteId: number | null
	blocks: IBlock[]
	serverIds: Set<number>
	data: IAplication | undefined
	savingId: number | null
	setBlocks: React.Dispatch<React.SetStateAction<IBlock[]>>
	setDirtyMap: React.Dispatch<React.SetStateAction<Record<number, boolean>>>
	setExpandedId: React.Dispatch<React.SetStateAction<number | null>>
	setDeleteId: React.Dispatch<React.SetStateAction<number | null>>
	setSavingId: React.Dispatch<React.SetStateAction<number | null>>
}

const AboutBlockDeleteModal: React.FC<Props> = memo(
	({
		open,
		deleteId,
		blocks,
		serverIds,
		data,
		savingId,
		setBlocks,
		setDirtyMap,
		setExpandedId,
		setDeleteId,
		setSavingId,
	}) => {
		const toast = useToast()

		const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation()

		const block = useMemo(
			() => blocks.find(item => item.id === deleteId) ?? null,
			[blocks, deleteId],
		)

		const blockTitle = useMemo(() => {
			if (!block) return "Без названия"
			const name = block.blockName?.trim()
			if (name?.length) return name
			return `Блок #${block.id}`
		}, [block])

		const isDeleting = useMemo(
			() => Boolean(deleteId) && isSaving && savingId === deleteId,
			[deleteId, isSaving, savingId],
		)

		const onClose = useCallback(() => setDeleteId(null), [setDeleteId])

		const onConfirm = useCallback(async () => {
			if (!block || deleteId === null) return
			if (!data) return

			if (!serverIds.has(deleteId)) {
				setBlocks(prev => prev.filter(item => item.id !== deleteId))
				setDirtyMap(prev => ({ ...prev, [deleteId]: false }))
				setDeleteId(null)
				toast.success("Блок удалён")
				return
			}

			setSavingId(deleteId)
			const nextBlocks = blocks.filter(item => item.id !== deleteId)
			const nextConfig = {
				...data,
				about: {
					...data.about,
					blocks: nextBlocks,
				},
			}

			try {
				await updateConfig(nextConfig).unwrap()
				setBlocks(nextBlocks)
				setDirtyMap(prev => ({ ...prev, [deleteId]: false }))
				setExpandedId(prev => (prev === deleteId ? null : prev))
				setDeleteId(null)
				toast.success("Блок удалён")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error("Ошибка удаления", serverError || "Не удалось удалить блок")
			} finally {
				setSavingId(null)
			}
		}, [
			block,
			blocks,
			data,
			deleteId,
			serverIds,
			setBlocks,
			setDeleteId,
			setDirtyMap,
			setExpandedId,
			setSavingId,
			toast,
			updateConfig,
		])

		const description = (
			<>
				Вы собираетесь удалить <strong>{blockTitle}</strong>. Действие
				необратимо.
			</>
		)

		const actions = (
			<>
				<Button className={styles.ghostBtn} onClick={onClose}>
					Отмена
				</Button>
				<Button
					className={styles.dangerBtn}
					onClick={onConfirm}
					disabled={isDeleting}
				>
					{isDeleting ? "Удаление..." : "Удалить"}
				</Button>
			</>
		)

		return (
			<Modal
				open={open}
				onClose={onClose}
				title='Удалить блок?'
				actions={actions}
			>
				{description}
			</Modal>
		)
	},
)

export default AboutBlockDeleteModal
