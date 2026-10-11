import React, { useCallback, useRef, useState } from "react"
import Button from "@shared/Button/Button"
import { useToast } from "@shared/Toast/useToast"
import { usePreviewUserCardsImportMutation } from "@shared/api/services/cards/CardsQuery"
import {
	CARDS_IMPORT_MAX_BYTES,
	type CardsImportReport,
} from "@shared/api/services/cards/types"
import styles from "./UserProfileCards.module.scss"
import UserProfileCardsImportModal, {
	type CardsImportFile,
} from "./UserProfileCardsImportModal"
import { parseCardsImportError } from "../lib/cardsImport"

type Props = {
	userId: string
	disabled?: boolean
}

/**
 * «Загрузить JSON»: выбор файла → проверка на фронте (размер, валидный JSON) →
 * dry-run на бэкенде → модалка с отчётом и подтверждением замены карточек.
 */
const UserProfileCardsImport: React.FC<Props> = ({ userId, disabled }) => {
	const [file, setFile] = useState<CardsImportFile | null>(null)
	const [report, setReport] = useState<CardsImportReport | null>(null)
	const [checkError, setCheckError] = useState<string | null>(null)
	const inputRef = useRef<HTMLInputElement | null>(null)

	const [previewImport, { isLoading: isChecking }] =
		usePreviewUserCardsImportMutation()
	const toast = useToast()

	const onPickFile = useCallback(() => {
		inputRef.current?.click()
	}, [])

	const onFileChange = useCallback(
		async (e: React.ChangeEvent<HTMLInputElement>) => {
			const picked = e.target.files?.[0]
			// Сбрасываем value, чтобы повторный выбор того же файла снова вызвал onChange
			e.target.value = ""
			if (!picked) return

			if (picked.size > CARDS_IMPORT_MAX_BYTES) {
				toast.error("Файл слишком большой", "Максимальный размер — 10 МБ")
				return
			}

			const content = await picked.text()
			try {
				JSON.parse(content)
			} catch {
				toast.error("Некорректный файл", "Файл не является валидным JSON")
				return
			}

			setFile({ name: picked.name, size: picked.size, content })
			setReport(null)
			setCheckError(null)

			try {
				const result = await previewImport({
					userId,
					fileContent: content,
				}).unwrap()
				setReport(result)
			} catch (err) {
				const failure = parseCardsImportError(
					err,
					"Не удалось проверить файл",
				)
				setReport(failure.report)
				setCheckError(failure.message)
			}
		},
		[previewImport, toast, userId],
	)

	const onClose = useCallback(() => {
		setFile(null)
		setReport(null)
		setCheckError(null)
	}, [])

	return (
		<>
			<Button className={styles.ghostBtn} onClick={onPickFile} disabled={disabled}>
				Загрузить JSON
			</Button>
			<input
				ref={inputRef}
				className={styles.hiddenInput}
				type='file'
				accept='application/json,.json'
				onChange={onFileChange}
			/>
			<UserProfileCardsImportModal
				userId={userId}
				file={file}
				report={report}
				checkError={checkError}
				isChecking={isChecking}
				setReport={setReport}
				onClose={onClose}
			/>
		</>
	)
}

export default UserProfileCardsImport
