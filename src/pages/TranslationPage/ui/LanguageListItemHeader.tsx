import React, { memo, useMemo } from "react"
import styles from "../TranslationPage.module.scss"
import type { LanguageItem } from "@shared/api/services/languages/types"
import cn from "classnames"

type Props = {
	localEmoji: string
	localName: string
	language: LanguageItem
	isDirty: boolean
}

const LanguageListItemHeader: React.FC<Props> = memo(
	({ localEmoji, localName, isDirty, language }) => {
		const updatedAtInfo = useMemo(() => {
			const parsed = new Date(language.updated_at)
			const isValid = !Number.isNaN(parsed.getTime())
			const today = new Date()
			const isToday = isValid && parsed.toDateString() === today.toDateString()
			const label = isValid
				? parsed.toLocaleDateString("ru-RU", {
						day: "2-digit",
						month: "2-digit",
						year: "numeric",
					})
				: "—"

			return { label, isToday }
		}, [language.updated_at])

		const badgeStyles = useMemo(
			() =>
				cn(styles.badge, {
					[styles.badgeDirty]: isDirty,
				}),
			[isDirty],
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
							{updatedAtInfo.isToday ? (
								<span className={styles.updatedToday}>Сегодня</span>
							) : null}
						</div>
					</div>
				</div>
				<div className={styles.langControls}>
					<span className={badgeStyles}>
						{isDirty ? "Черновик" : "Синхронизировано"}
					</span>
				</div>
			</div>
		)
	},
)

export default LanguageListItemHeader
