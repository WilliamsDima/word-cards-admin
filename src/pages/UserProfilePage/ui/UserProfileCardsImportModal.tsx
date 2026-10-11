import React, { useCallback, useMemo, useState } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import Loading from "@shared/Loading/Loading"
import { useToast } from "@shared/Toast/useToast"
import { useImportUserCardsMutation } from "@shared/api/services/cards/CardsQuery"
import type { CardsImportReport } from "@shared/api/services/cards/types"
import styles from "./UserProfileCards.module.scss"
import UserProfileCardsImportReport from "./UserProfileCardsImportReport"
import { formatFileSize, parseCardsImportError } from "../lib/cardsImport"

export type CardsImportFile = {
	name: string
	size: number
	content: string
}

type Props = {
	userId: string
	file: CardsImportFile | null
	report: CardsImportReport | null
	checkError: string | null
	isChecking: boolean
	setReport: React.Dispatch<React.SetStateAction<CardsImportReport | null>>
	onClose: () => void
}

const UserProfileCardsImportModal: React.FC<Props> = ({
	userId,
	file,
	report,
	checkError,
	isChecking,
	setReport,
	onClose,
}) => {
	const [importError, setImportError] = useState<string | null>(null)

	const [importCards, { isLoading: isImporting }] = useImportUserCardsMutation()
	const toast = useToast()

	const fileLabel = useMemo(
		() => (file ? `${file.name} · ${formatFileSize(file.size)}` : ""),
		[file],
	)

	const errorText = useMemo(
		() => importError ?? checkError,
		[checkError, importError],
	)

	const isValid = useMemo(() => Boolean(report?.valid), [report])

	const isReportVisible = useMemo(
		() => Boolean(report) && !isChecking,
		[isChecking, report],
	)

	const isConfirmDisabled = useMemo(
		() => !isValid || isChecking || isImporting,
		[isChecking, isImporting, isValid],
	)

	const onCloseModal = useCallback(() => {
		if (isImporting) return
		setImportError(null)
		onClose()
	}, [isImporting, onClose])

	const onConfirm = useCallback(async () => {
		if (!file || !report?.valid) return
		setImportError(null)
		try {
			const result = await importCards({
				userId,
				fileContent: file.content,
			}).unwrap()
			toast.success(
				"Карточки импортированы",
				`Создано карточек: ${result.cards_to_create}. Засчитано в достижение: ${result.cards_created_credited ?? 0}`,
			)
			onClose()
		} catch (err) {
			const failure = parseCardsImportError(
				err,
				"Не удалось импортировать файл",
			)
			if (failure.report) setReport(failure.report)
			setImportError(failure.message)
			toast.error("Ошибка импорта", failure.message)
		}
	}, [file, importCards, onClose, report, setReport, toast, userId])

	return (
		<Modal
			open={Boolean(file)}
			onClose={onCloseModal}
			title='Импорт карточек из JSON'
			className={styles.modal}
			contentClassName={styles.modalContent}
			dismissible={!isImporting}
			actions={
				<>
					<Button
						className={styles.ghostBtn}
						onClick={onCloseModal}
						disabled={isImporting}
					>
						Отмена
					</Button>
					<Button
						className={styles.dangerBtn}
						onClick={onConfirm}
						disabled={isConfirmDisabled}
						aria-busy={isImporting}
					>
						{isImporting ? (
							<>
								<Loading className={styles.btnSpinner} />
								Импорт...
							</>
						) : (
							"Заменить карточки"
						)}
					</Button>
				</>
			}
		>
			<div className={styles.importBody}>
				<span className={styles.importFile}>{fileLabel}</span>

				{isChecking ? (
					<div className={styles.loadingState}>
						<Loading className={styles.importSpinner} />
						<span>Проверяем файл...</span>
					</div>
				) : (
					<></>
				)}

				{report && isReportVisible ? (
					<UserProfileCardsImportReport report={report} />
				) : (
					<></>
				)}

				{report && isReportVisible && isValid ? (
					<div className={styles.importWarning}>
						Все текущие карточки пользователя ({report.cards_to_delete}) будут
						удалены и заменены данными из файла. Действие необратимо.
					</div>
				) : (
					<></>
				)}

				{isReportVisible && !isValid ? (
					<div className={styles.formError}>
						Файл содержит ошибки — импорт невозможен. Исправьте файл и
						загрузите его снова.
					</div>
				) : (
					<></>
				)}

				{errorText && !isChecking ? (
					<div className={styles.formError}>{errorText}</div>
				) : (
					<></>
				)}
			</div>
		</Modal>
	)
}

export default UserProfileCardsImportModal
