import React, { memo, useCallback, useMemo } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import { useToast } from "@shared/Toast/useToast"
import { useUpdateAppConfigMutation } from "@shared/api/services/appConfig/AppConfigQuery"
import type {
	IAplication,
	ShowVariantsOption,
} from "@shared/api/services/appConfig/types"
import styles from "./ShowVariantItem.module.scss"

type Props = {
	open: boolean
	variant: ShowVariantsOption | null
	appConfig: IAplication | undefined
	onClose: () => void
}

const ShowVariantDeleteModal: React.FC<Props> = memo(
	({ open, variant, appConfig, onClose }) => {
		const [updateConfig, { isLoading: isSaving }] =
			useUpdateAppConfigMutation()
		const toast = useToast()

		const variantTitle = useMemo(() => {
			if (!variant) return "Без названия"
			const label = variant.label?.trim()
			if (label?.length) return label
			return variant.value
		}, [variant])

		const isDeleting = useMemo(
			() => Boolean(variant) && isSaving,
			[variant, isSaving],
		)

		const onConfirm = useCallback(async () => {
			if (!variant || !appConfig) return
			const nextVariants = appConfig.showVariantsList.filter(
				item => item.value !== variant.value,
			)
			const nextConfig = {
				...appConfig,
				showVariantsList: nextVariants,
			}

			try {
				await updateConfig(nextConfig).unwrap()
				onClose()
				toast.success("Вариант удалён")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка удаления",
					serverError || "Не удалось удалить вариант",
				)
			}
		}, [appConfig, onClose, toast, updateConfig, variant])

		return (
			<Modal
				open={open}
				onClose={onClose}
				title='Удалить вариант?'
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
					Вы собираетесь удалить <strong>{variantTitle}</strong>. Действие
					необратимо.
				</>
			</Modal>
		)
	},
)

export default ShowVariantDeleteModal

