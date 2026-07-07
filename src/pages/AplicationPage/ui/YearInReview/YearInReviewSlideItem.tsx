import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import styles from "./YearInReview.module.scss"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import Checkbox from "@shared/Checkbox/Checkbox"
import Badge, { BadgeVariant } from "@shared/Badge/Badge"
import { useUpdateAppConfigMutation } from "@shared/api/services/appConfig/AppConfigQuery"
import { useToast } from "@shared/Toast/useToast"
import type {
	IAplication,
	IYearInReviewSlide,
} from "@shared/api/services/appConfig/types"
import {
	areTranslationsEqual,
	buildTranslationsDraft,
	countFilledTranslations,
	type LanguageOption,
	type TranslationsDraft,
} from "./utils"
import { SLIDE_ID_LABELS } from "./constants"
import YearInReviewSlideModal from "./YearInReviewSlideModal"

type Props = {
	slide: IYearInReviewSlide
	appConfig: IAplication | undefined
	languages: LanguageOption[]
}

const YearInReviewSlideItem: React.FC<Props> = memo(
	({ slide, appConfig, languages }) => {
		const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation()
		const toast = useToast()

		const languageCodes = useMemo(
			() => languages.map(language => language.code),
			[languages],
		)

		const allCodes = useMemo(() => {
			const codes = new Set(languageCodes)
			Object.keys(slide.translations).forEach(code => codes.add(code))
			return Array.from(codes)
		}, [languageCodes, slide.translations])

		const [enabled, setEnabled] = useState(slide.enabled)
		const [sortOrder, setSortOrder] = useState(String(slide.sort_order))
		const [translations, setTranslations] = useState<TranslationsDraft>(() =>
			buildTranslationsDraft(slide.translations, allCodes),
		)
		const [isModalOpen, setIsModalOpen] = useState(false)

		const title = useMemo(() => SLIDE_ID_LABELS[slide.id], [slide.id])

		const filledCount = useMemo(
			() => countFilledTranslations(translations, allCodes),
			[allCodes, translations],
		)

		const meta = useMemo(
			() => `ID: ${slide.id} • Переводы: ${filledCount}/${allCodes.length}`,
			[allCodes.length, filledCount, slide.id],
		)

		const parsedSortOrder = useMemo(() => Number(sortOrder), [sortOrder])

		const isSortOrderInvalid = useMemo(
			() => !Number.isFinite(parsedSortOrder),
			[parsedSortOrder],
		)

		const isDirty = useMemo(() => {
			if (enabled !== slide.enabled) return true
			if (!isSortOrderInvalid && parsedSortOrder !== slide.sort_order)
				return true
			return !areTranslationsEqual(translations, slide.translations, allCodes)
		}, [
			allCodes,
			enabled,
			isSortOrderInvalid,
			parsedSortOrder,
			slide.enabled,
			slide.sort_order,
			slide.translations,
			translations,
		])

		const badgeText = useMemo(() => {
			if (isSortOrderInvalid) return "Некорректная сортировка"
			if (isDirty) return "Есть изменения"
			return "Синхронизировано"
		}, [isDirty, isSortOrderInvalid])

		const badgeVariant = useMemo<BadgeVariant>(() => {
			if (badgeText === "Некорректная сортировка") return "warning"
			if (badgeText === "Есть изменения") return "success"
			return "neutral"
		}, [badgeText])

		const isSaveDisabled = useMemo(
			() => !isDirty || isSortOrderInvalid || isSaving,
			[isDirty, isSaving, isSortOrderInvalid],
		)

		const isResetDisabled = useMemo(
			() => !isDirty || isSaving,
			[isDirty, isSaving],
		)

		const saveLabel = useMemo(
			() => (isSaving ? "Сохранение..." : "Сохранить"),
			[isSaving],
		)

		const onToggleEnabled = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setEnabled(e.target.checked),
			[],
		)

		const onChangeSortOrder = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setSortOrder(e.target.value),
			[],
		)

		const onOpenModal = useCallback(() => setIsModalOpen(true), [])
		const onCloseModal = useCallback(() => setIsModalOpen(false), [])

		const onSaveTranslations = useCallback((next: TranslationsDraft) => {
			setTranslations(next)
			setIsModalOpen(false)
		}, [])

		const onSaveHandler = useCallback(async () => {
			if (!appConfig || isSortOrderInvalid) return
			const nextSlides = appConfig.year_in_review.slides.map(item =>
				item.id === slide.id
					? {
							...item,
							enabled,
							sort_order: parsedSortOrder,
							translations,
						}
					: item,
			)
			const nextConfig = {
				...appConfig,
				year_in_review: {
					...appConfig.year_in_review,
					slides: nextSlides,
				},
			}

			try {
				await updateConfig(nextConfig).unwrap()
				toast.success("Слайд обновлён")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось обновить слайд",
				)
			}
		}, [
			appConfig,
			enabled,
			isSortOrderInvalid,
			parsedSortOrder,
			slide.id,
			toast,
			translations,
			updateConfig,
		])

		const onResetHandler = useCallback(() => {
			setEnabled(slide.enabled)
			setSortOrder(String(slide.sort_order))
			setTranslations(buildTranslationsDraft(slide.translations, allCodes))
		}, [allCodes, slide.enabled, slide.sort_order, slide.translations])

		useEffect(() => {
			setEnabled(slide.enabled)
			setSortOrder(String(slide.sort_order))
			setTranslations(buildTranslationsDraft(slide.translations, allCodes))
		}, [allCodes, slide.enabled, slide.sort_order, slide.translations])

		return (
			<>
				<div className={styles.slideCard}>
					<div className={styles.slideHeader}>
						<div className={styles.titleBlock}>
							<p className={styles.title}>{title}</p>
							<p className={styles.meta}>{meta}</p>
						</div>
						<Badge label={badgeText} variant={badgeVariant} />
					</div>

					<div className={styles.slideFields}>
						<Checkbox
							label='Включён'
							checked={enabled}
							onChange={onToggleEnabled}
						/>

						<label className={styles.field}>
							<span className={styles.label}>Сортировка</span>
							<Input
								inputMode='numeric'
								value={sortOrder}
								onChange={onChangeSortOrder}
							/>
						</label>

						<Button className={styles.ghostBtn} onClick={onOpenModal}>
							Редактировать переводы
						</Button>
					</div>

					<div className={styles.actions}>
						<Button
							className={styles.primaryBtn}
							onClick={onSaveHandler}
							disabled={isSaveDisabled}
						>
							{saveLabel}
						</Button>
						<Button
							className={styles.ghostBtn}
							onClick={onResetHandler}
							disabled={isResetDisabled}
						>
							Отменить
						</Button>
					</div>
				</div>

				<YearInReviewSlideModal
					open={isModalOpen}
					slideTitle={title}
					languages={languages}
					translations={translations}
					onSave={onSaveTranslations}
					onClose={onCloseModal}
				/>
			</>
		)
	},
)

export default YearInReviewSlideItem
