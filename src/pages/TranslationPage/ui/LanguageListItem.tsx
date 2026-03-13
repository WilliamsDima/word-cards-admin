import React, { memo, useCallback, useMemo } from "react"
import Button from "@shared/Button/Button"
import { githubDarkTheme, JsonEditor } from "json-edit-react"
import type { JsonValue, LanguageItem } from "@shared/api/types"
import cn from "classnames"
import styles from "../TranslationPage.module.scss"
import { useUpdateLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"
import { DirtyMap, DraftMap } from "../TranslationPage"

type Props = {
	language: LanguageItem
	isExpanded: boolean
	isDirty: boolean
	draft: JsonValue
	drafts: DraftMap
	onToggle: (code: string) => void
	onChangeJson: (code: string, value: unknown) => void
	onReset: (language: LanguageItem) => void
	setDirtyMap: React.Dispatch<React.SetStateAction<DirtyMap>>
	setDeleteTarget: React.Dispatch<React.SetStateAction<LanguageItem | null>>
}

const LanguageListItem: React.FC<Props> = memo(
	({
		language,
		isExpanded,
		isDirty,
		draft,
		drafts,
		onToggle,
		onChangeJson,
		onReset,
		setDirtyMap,
		setDeleteTarget,
	}) => {
		const [updateLanguage, { isLoading: isSaving }] =
			useUpdateLanguageMutation()

		const onDeleteHandler = () => onDelete(language)
		const onResetHandler = () => onReset(language)
		const onSaveHandler = () => onSave(language)
		const onChangeJsonHandler = (value: unknown) =>
			onChangeJson(language.code, value)
		const onToggleHandler = () => onToggle(language.code)

		const onSave = useCallback(
			async (language: LanguageItem) => {
				const draft = drafts[language.code] ?? language.json
				if (!draft) return
				await updateLanguage({
					id: language.id,
					payload: {
						code: language.code,
						emoji: language.emoji,
						name: language.name,
						json: draft,
					},
				}).unwrap()
				setDirtyMap(prev => ({ ...prev, [language.code]: false }))
			},
			[drafts, updateLanguage, setDirtyMap],
		)

		const onDelete = useCallback(
			(language: LanguageItem) => {
				setDeleteTarget(language)
			},
			[setDeleteTarget],
		)

		const expandedStyles = useMemo(
			() =>
				cn(styles.langCard, {
					[styles.expanded]: isExpanded,
				}),
			[isExpanded],
		)

		const badgeStyles = useMemo(
			() =>
				cn(styles.badge, {
					[styles.badgeDirty]: isDirty,
				}),
			[isDirty],
		)

		const chevronStyles = useMemo(
			() =>
				cn(styles.chevron, {
					[styles.chevronOpen]: isExpanded,
				}),
			[isExpanded],
		)

		return (
			<article className={expandedStyles}>
				<button
					className={styles.langHeader}
					onClick={onToggleHandler}
					type='button'
				>
					<div className={styles.langInfo}>
						<span className={styles.langEmoji}>{language.emoji}</span>
						<div className={styles.langText}>
							<span className={styles.langName}>{language.name}</span>
							<span className={styles.langMeta}>
								{language.code.toUpperCase()}
							</span>
						</div>
					</div>
					<div className={styles.langControls}>
						<span className={badgeStyles}>
							{isDirty ? "Черновик" : "Синхронизировано"}
						</span>
						<span className={chevronStyles} />
					</div>
				</button>

				<div className={styles.langBody}>
					<div className={styles.editorWrap}>
						<JsonEditor
							data={draft}
							setData={onChangeJsonHandler}
							rootName=''
							showArrayIndices={false}
							showCollectionCount={false}
							theme={[githubDarkTheme]}
							maxWidth='100%'
							minWidth='100%'
							className={styles.jsonEditor}
						/>
					</div>

					<div className={styles.actions}>
						<Button
							className={styles.primaryBtn}
							disabled={!isDirty || isSaving}
							onClick={onSaveHandler}
						>
							{isSaving ? "Сохранение..." : "Сохранить"}
						</Button>
						<Button
							className={styles.ghostBtn}
							onClick={onResetHandler}
							disabled={isSaving}
						>
							Отменить
						</Button>
						<Button className={styles.dangerBtn} onClick={onDeleteHandler}>
							Удалить
						</Button>
					</div>
				</div>
			</article>
		)
	},
)

export default LanguageListItem
