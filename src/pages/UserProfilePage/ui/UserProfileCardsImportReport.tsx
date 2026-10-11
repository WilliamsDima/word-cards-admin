import React, { memo, useMemo } from "react"
import Badge from "@shared/Badge/Badge"
import { dateService } from "@shared/lib/date"
import {
	statusLabels,
	statusVariants,
	type CardsImportReport,
	type CardStatus,
} from "@shared/api/services/cards/types"
import styles from "./UserProfileCards.module.scss"

type Props = {
	report: CardsImportReport
}

const STATUS_ORDER: CardStatus[] = ["READY", "STUDY"]

const formatLabels: Record<string, string> = {
	envelope: "Экспорт приложения",
	legacy_array: "Массив карточек (старый формат)",
}

const exportedAtFormat: Intl.DateTimeFormatOptions = {
	day: "2-digit",
	month: "2-digit",
	year: "numeric",
	hour: "2-digit",
	minute: "2-digit",
}

/** Отчёт dry-run/импорта: что будет создано и удалено, ошибки по индексам карточек */
const UserProfileCardsImportReport: React.FC<Props> = memo(({ report }) => {
	const formatLabel = useMemo(() => {
		const label = formatLabels[report.format] ?? "Не определён"
		return report.format === "envelope" && report.version
			? `${label}, v${report.version}`
			: label
	}, [report.format, report.version])

	const exportedAtLabel = useMemo(() => {
		if (!report.exported_at) return "—"
		return (
			dateService.format(report.exported_at, exportedAtFormat) ??
			report.exported_at
		)
	}, [report.exported_at])

	const statuses = useMemo(
		() =>
			STATUS_ORDER.map(status => ({
				status,
				label: `${statusLabels[status]}: ${report.statuses?.[status] ?? 0}`,
			})),
		[report.statuses],
	)

	const creditedCount = useMemo(
		() => report.cards_created_credited ?? 0,
		[report.cards_created_credited],
	)

	const creditedLabel = useMemo(
		() =>
			report.imported
				? `Засчитано: ${creditedCount}`
				: `Будет засчитано в достижение «Создано карточек»: ${creditedCount}`,
		[creditedCount, report.imported],
	)

	const isCreditedHintVisible = useMemo(
		() => creditedCount === 0,
		[creditedCount],
	)

	const languages = useMemo(() => report.languages ?? [], [report.languages])
	const errors = useMemo(() => report.errors ?? [], [report.errors])

	const hiddenErrorsCount = useMemo(
		() => Math.max(report.errors_total - errors.length, 0),
		[errors.length, report.errors_total],
	)

	return (
		<div className={styles.importReport}>
			<div className={styles.importStats}>
				<span className={styles.label}>Формат</span>
				<span>{formatLabel}</span>
				<span className={styles.label}>Дата экспорта</span>
				<span>{exportedAtLabel}</span>
				<span className={styles.label}>Карточек в файле</span>
				<span>{report.total_in_file}</span>
				<span className={styles.label}>Будет создано карточек</span>
				<span>{report.cards_to_create}</span>
				<span className={styles.label}>Будет создано слов</span>
				<span>{report.items_to_create}</span>
				<span className={styles.label}>Будет удалено карточек</span>
				<span>{report.cards_to_delete}</span>
			</div>

			{report.valid ? (
				<div className={styles.importSection}>
					<span className={styles.importCredited}>{creditedLabel}</span>
					{isCreditedHintVisible ? (
						<span className={styles.label}>
							Эти карточки уже учтены в метрике (например, повторный импорт
							того же файла) — достижение не изменится.
						</span>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}

			<div className={styles.importSection}>
				<span className={styles.label}>Статусы</span>
				<div className={styles.importBadges}>
					{statuses.map(item => (
						<Badge
							key={item.status}
							label={item.label}
							variant={statusVariants[item.status]}
						/>
					))}
				</div>
			</div>

			<div className={styles.importSection}>
				<span className={styles.label}>Языки</span>
				<div className={styles.importBadges}>
					{languages.length ? (
						languages.map(language => (
							<Badge
								key={language.code}
								label={`${language.code.toUpperCase()}: ${language.cards}`}
								variant='info'
							/>
						))
					) : (
						<span className={styles.label}>—</span>
					)}
				</div>
			</div>

			{report.errors_total > 0 ? (
				<div className={styles.importSection}>
					<span className={styles.label}>Ошибки: {report.errors_total}</span>
					<ul className={styles.importErrors}>
						{errors.map((error, i) => (
							<li
								key={`${error.index ?? "file"}-${error.field}-${i}`}
								className={styles.importErrorRow}
							>
								<span className={styles.importErrorIndex}>
									{error.index === null ? "Файл" : `Карточка [${error.index}]`}
								</span>
								{error.field ? (
									<code className={styles.importErrorField}>{error.field}</code>
								) : (
									<></>
								)}
								<span>{error.message}</span>
							</li>
						))}
					</ul>
					{hiddenErrorsCount > 0 ? (
						<span className={styles.label}>
							Показаны первые {errors.length}, ещё {hiddenErrorsCount} скрыто
						</span>
					) : (
						<></>
					)}
				</div>
			) : (
				<></>
			)}
		</div>
	)
})

export default UserProfileCardsImportReport
