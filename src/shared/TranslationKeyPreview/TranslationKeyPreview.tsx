import React, { memo, useMemo } from "react"
import cn from "classnames"
import styles from "./TranslationKeyPreview.module.scss"
import {
	PREVIEW_LANGUAGE_CODE,
	type TranslationPreview,
} from "@shared/lib/translationPreview"

type Props = {
	preview: TranslationPreview | null
	className?: string
}

const languageLabel = PREVIEW_LANGUAGE_CODE.toUpperCase()

/** Превью текста за ключом перевода или ошибка «ключ не найден» */
const TranslationKeyPreview: React.FC<Props> = memo(({ preview, className }) => {
	const rootClassName = useMemo(
		() =>
			cn(styles.preview, className, {
				[styles.missing]: preview?.status === "missing",
			}),
		[className, preview?.status],
	)

	if (!preview) return <></>

	return (
		<span className={rootClassName}>
			<span className={styles.lang}>{languageLabel}</span>
			{preview.status === "found" ? (
				<span className={styles.text}>{preview.text}</span>
			) : (
				<span className={styles.text}>Ключ не найден в переводе</span>
			)}
		</span>
	)
})

export default TranslationKeyPreview
