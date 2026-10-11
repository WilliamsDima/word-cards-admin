import React, { useCallback, useMemo } from "react"
import Button from "@shared/Button/Button"
import { useToast } from "@shared/Toast/useToast"
import { useExportUserCardsMutation } from "@shared/api/services/cards/CardsQuery"
import styles from "./UserProfileCards.module.scss"
import { parseCardsImportError } from "../lib/cardsImport"
import { downloadCardsExportFile } from "../lib/cardsExport"

type Props = {
	userId: string
	disabled?: boolean
}

/**
 * «Скачать JSON»: по клику выгружает все карточки пользователя (all=true)
 * и сохраняет файл в формате мобильного экспорта (его принимает «Загрузить JSON»).
 */
const UserProfileCardsExport: React.FC<Props> = ({ userId, disabled }) => {
	const [exportCards, { isLoading }] = useExportUserCardsMutation()
	const toast = useToast()

	const isDisabled = useMemo(
		() => Boolean(disabled) || isLoading,
		[disabled, isLoading],
	)

	const onExport = useCallback(async () => {
		try {
			const result = await exportCards({ userId }).unwrap()
			downloadCardsExportFile(result.items)
			if (result.total > result.items.length) {
				toast.warning(
					"Экспорт неполный",
					`Выгружено ${result.items.length} из ${result.total} карточек — достигнут лимит выгрузки`,
				)
				return
			}
			toast.success(
				"Карточки выгружены",
				`Карточек в файле: ${result.items.length}`,
			)
		} catch (err) {
			const failure = parseCardsImportError(
				err,
				"Не удалось выгрузить карточки",
			)
			toast.error("Ошибка экспорта", failure.message)
		}
	}, [exportCards, toast, userId])

	return (
		<Button
			className={styles.ghostBtn}
			onClick={onExport}
			disabled={isDisabled}
		>
			{isLoading ? "Выгрузка..." : "Скачать JSON"}
		</Button>
	)
}

export default UserProfileCardsExport
