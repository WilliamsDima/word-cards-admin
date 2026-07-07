import React, { memo, useMemo } from "react"
import Card from "@shared/Card/Card"
import styles from "./YearInReview.module.scss"
import YearInReviewWindow from "./YearInReviewWindow"
import YearInReviewSlidesList from "./YearInReviewSlidesList"
import { useGetLanguagesQuery } from "@shared/api/services/languages/LanguagesQuery"
import type { LanguageOption } from "./utils"

const YearInReview: React.FC = memo(() => {
	const { data: languagesData } = useGetLanguagesQuery()

	const languages = useMemo<LanguageOption[]>(() => {
		if (!languagesData) return []
		return Object.values(languagesData)
			.map(language => ({ code: language.code, name: language.name }))
			.sort((a, b) => a.name.localeCompare(b.name))
	}, [languagesData])

	return (
		<Card className={styles.card}>
			<div className={styles.header}>
				<div>
					<h2 className={styles.title}>Итоги года</h2>
					<p className={styles.subtitle}>
						Настройка окна показа модалки "Итоги года" и содержимого слайдов в
						мобильном приложении.
					</p>
				</div>
			</div>

			<YearInReviewWindow />

			<YearInReviewSlidesList languages={languages} />
		</Card>
	)
})

export default YearInReview
