import React, { memo, useMemo } from "react"
import styles from "./YearInReview.module.scss"
import Loading from "@shared/Loading/Loading"
import { useGetAppConfigQuery } from "@shared/api/services/appConfig/AppConfigQuery"
import type { IYearInReviewSlide } from "@shared/api/services/appConfig/types"
import YearInReviewSlideItem from "./YearInReviewSlideItem"
import type { LanguageOption } from "./utils"

type Props = {
	languages: LanguageOption[]
}

const YearInReviewSlidesList: React.FC<Props> = memo(({ languages }) => {
	const { data, isLoading, isError } = useGetAppConfigQuery()

	const sortedSlides = useMemo<IYearInReviewSlide[]>(() => {
		const slides = data?.year_in_review.slides ?? []
		return [...slides].sort((a, b) => a.sort_order - b.sort_order)
	}, [data])

	return (
		<div className={styles.slidesBlock}>
			<div className={styles.windowHeader}>
				<div>
					<h3 className={styles.blockTitle}>Слайды</h3>
					<p className={styles.blockSubtitle}>
						Фиксированный каталог слайдов — включайте/выключайте, меняйте
						порядок и редактируйте текст на каждом языке.
					</p>
				</div>
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<Loading className={styles.spinner} />
					<span>Загружаем слайды...</span>
				</div>
			) : (
				<></>
			)}

			{isError && !isLoading ? (
				<div className={styles.empty}>
					<span className={styles.emptyTitle}>
						Не удалось загрузить слайды
					</span>
					<span className={styles.emptyText}>
						Проверьте подключение и повторите попытку позже.
					</span>
				</div>
			) : (
				<></>
			)}

			{!isLoading && !isError ? (
				<div className={styles.slidesList}>
					{sortedSlides.map(slide => (
						<YearInReviewSlideItem
							key={slide.id}
							slide={slide}
							appConfig={data}
							languages={languages}
						/>
					))}
				</div>
			) : (
				<></>
			)}
		</div>
	)
})

export default YearInReviewSlidesList
