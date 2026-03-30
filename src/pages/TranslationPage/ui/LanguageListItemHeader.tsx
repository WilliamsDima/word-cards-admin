import React, { memo, useMemo } from "react"
import styles from "../TranslationPage.module.scss"
import type { LanguageItem } from "@shared/api/services/languages/types"
import Badge, { BadgeVariant } from "@shared/Badge/Badge"
import { dateService } from "@shared/lib/date"

type Props = {
	localEmoji: string
	localName: string
	language: LanguageItem
	isDirty: boolean
}

const LanguageListItemHeader: React.FC<Props> = memo(
	({ localEmoji, localName, isDirty, language }) => {
		const updatedAtInfo = useMemo(() => {
			const label =
				dateService.format(language.updated_at, {
					day: "2-digit",
					month: "2-digit",
					year: "numeric",
				}) ?? "—"
			const isToday = dateService.isSameDay(language.updated_at)
			return { label, isToday }
		}, [language.updated_at])

		const badgeLabel = useMemo(
			() => (isDirty ? "Черновик" : "Синхронизировано"),
			[isDirty],
		)
		const badgeVariant = useMemo<BadgeVariant>(
			() => (isDirty ? "warning" : "neutral"),
			[isDirty],
		)
		const todayBadge = useMemo(
			() =>
				updatedAtInfo.isToday ? (
					<Badge label='Сегодня' variant='info' />
				) : null,
			[updatedAtInfo.isToday],
		)

		return (
			<div className={styles.langHeaderContent}>
				<div className={styles.langInfo}>
					<span className={styles.langEmoji}>
						{localEmoji || language.emoji}
					</span>
					<div className={styles.langText}>
						<span className={styles.langName}>
							{localName || language.name}
						</span>
						<div className={styles.langMetaRow}>
							<span className={styles.langMeta}>
								{language.code.toUpperCase()}
							</span>
							<span className={styles.updatedAt}>
								Обновлено: {updatedAtInfo.label}
							</span>
							{todayBadge}
						</div>
					</div>
				</div>
				<div className={styles.langControls}>
					<Badge label={badgeLabel} variant={badgeVariant} />
				</div>
			</div>
		)
	},
)

export default LanguageListItemHeader
