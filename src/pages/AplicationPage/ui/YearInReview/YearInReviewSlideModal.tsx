import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import styles from "./YearInReview.module.scss"
import YearInReviewLanguageTab from "./YearInReviewLanguageTab"
import type { LanguageOption, TranslationsDraft } from "./utils"

type Props = {
	open: boolean
	slideTitle: string
	languages: LanguageOption[]
	translations: TranslationsDraft
	onSave: (next: TranslationsDraft) => void
	onClose: () => void
}

const emptyEntry = { title: "", description: "" }

const YearInReviewSlideModal: React.FC<Props> = memo(
	({ open, slideTitle, languages, translations, onSave, onClose }) => {
		const [localTranslations, setLocalTranslations] =
			useState<TranslationsDraft>(translations)
		const [activeCode, setActiveCode] = useState<string>(
			languages[0]?.code ?? "",
		)

		const title = useMemo(() => `Переводы: ${slideTitle}`, [slideTitle])

		const activeEntry = useMemo(
			() => localTranslations[activeCode] ?? emptyEntry,
			[activeCode, localTranslations],
		)

		const onSelectLanguage = useCallback((code: string) => {
			setActiveCode(code)
		}, [])

		const onChangeTitle = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value
				setLocalTranslations(prev => ({
					...prev,
					[activeCode]: {
						title: value,
						description: prev[activeCode]?.description ?? "",
					},
				}))
			},
			[activeCode],
		)

		const onChangeDescription = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => {
				const value = e.target.value
				setLocalTranslations(prev => ({
					...prev,
					[activeCode]: {
						title: prev[activeCode]?.title ?? "",
						description: value,
					},
				}))
			},
			[activeCode],
		)

		const onSaveHandler = useCallback(() => {
			onSave(localTranslations)
		}, [localTranslations, onSave])

		const onCloseHandler = useCallback(() => {
			onClose()
		}, [onClose])

		useEffect(() => {
			if (!open) return
			setLocalTranslations(translations)
			setActiveCode(prev => {
				if (languages.some(language => language.code === prev)) return prev
				return languages[0]?.code ?? ""
			})
		}, [languages, open, translations])

		return (
			<Modal
				open={open}
				onClose={onCloseHandler}
				title={title}
				className={styles.slideModal}
				contentClassName={styles.slideModalContent}
				actions={
					<>
						<Button className={styles.ghostBtn} onClick={onCloseHandler}>
							Отмена
						</Button>
						<Button className={styles.primaryBtn} onClick={onSaveHandler}>
							Сохранить
						</Button>
					</>
				}
			>
				<div className={styles.languageTabs}>
					{languages.map(language => {
						const entry = localTranslations[language.code]
						const filled = Boolean(
							entry?.title?.trim().length || entry?.description?.trim().length,
						)
						return (
							<YearInReviewLanguageTab
								key={language.code}
								code={language.code}
								name={language.name}
								active={language.code === activeCode}
								filled={filled}
								onSelect={onSelectLanguage}
							/>
						)
					})}
				</div>

				<div className={styles.slideModalFields}>
					<label className={styles.field}>
						<span className={styles.label}>Заголовок</span>
						<Input value={activeEntry.title} onChange={onChangeTitle} />
					</label>
					<label className={styles.field}>
						<span className={styles.label}>Описание</span>
						<Input
							value={activeEntry.description}
							onChange={onChangeDescription}
						/>
					</label>
				</div>
			</Modal>
		)
	},
)

export default YearInReviewSlideModal
