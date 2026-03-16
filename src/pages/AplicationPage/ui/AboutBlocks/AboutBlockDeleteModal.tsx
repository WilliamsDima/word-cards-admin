import React, { memo, useCallback, useMemo } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import type { IAplication, IBlock } from "@shared/api/services/appConfig/types"
import styles from "./AboutBlocks.module.scss"
import { useToast } from "@shared/Toast/useToast"
import { useUpdateAppConfigMutation } from "@shared/api/services/appConfig/AppConfigQuery"

type Props = {
	open: boolean
	block: IBlock | null
	appConfig: IAplication | undefined
	onClose: () => void
}

const AboutBlockDeleteModal: React.FC<Props> = memo(
	({ open, block, appConfig, onClose }) => {
		const [updateConfig, { isLoading: isSaving }] =
			useUpdateAppConfigMutation()
		const toast = useToast()

		const blockTitle = useMemo(() => {
			if (!block) return "Без названия"
			const name = block.blockName?.trim()
			if (name?.length) return name
			return `Блок #${block.id}`
		}, [block])

		const isDeleting = useMemo(
			() => Boolean(block) && isSaving,
			[block, isSaving],
		)

		const onConfirm = useCallback(async () => {
			if (!block || !appConfig) return
			const nextBlocks = appConfig.about.blocks.filter(
				item => item.id !== block.id,
			)
			const nextConfig = {
				...appConfig,
				about: {
					...appConfig.about,
					blocks: nextBlocks,
				},
			}

			try {
				await updateConfig(nextConfig).unwrap()
				onClose()
				toast.success("Блок удалён")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка удаления",
					serverError || "Не удалось удалить блок",
				)
			}
		}, [appConfig, block, onClose, toast, updateConfig])

		return (
			<Modal
				open={open}
				onClose={onClose}
				title='Удалить блок?'
				actions={
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
				}
			>
				<>
					Вы собираетесь удалить <strong>{blockTitle}</strong>. Действие
					необратимо.
				</>
			</Modal>
		)
	},
)

export default AboutBlockDeleteModal

