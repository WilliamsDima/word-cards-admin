import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import Button from "@shared/Button/Button"
import { githubDarkTheme, JsonEditor } from "json-edit-react"
import cn from "classnames"
import styles from "../TranslationPage.module.scss"
import { useUpdateLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"
import { DirtyMap, DraftMap } from "../TranslationPage"
import { useToast } from "@shared/Toast/useToast"
import type {
	JsonValue,
	LanguageItem,
} from "@shared/api/services/languages/types"
import Accordion from "@shared/Accordion/Accordion"
import LanguageListItemInputs from "./LanguageListItemInputs"
import LanguageListItemHeader from "./LanguageListItemHeader"

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
		const toast = useToast()
		const [localName, setLocalName] = useState(language.name)
		const [localEmoji, setLocalEmoji] = useState(language.emoji)

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
				try {
					await updateLanguage({
						id: language.id,
						payload: {
							code: language.code,
							emoji: localEmoji.trim(),
							name: localName.trim(),
							json: draft,
						},
					}).unwrap()
					setDirtyMap(prev => ({ ...prev, [language.code]: false }))
					toast.success("Язык обновлён", localName)
				} catch (err) {
					const serverError =
						(err as { data?: { data?: { error?: string } } })?.data?.data
							?.error ?? null
					toast.error(
						"Ошибка обновления",
						serverError || "Не удалось обновить язык",
					)
				}
			},
			[drafts, updateLanguage, setDirtyMap, localEmoji, localName, toast],
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

		const metaDirty = useMemo(() => {
			return (
				localName.trim() !== language.name ||
				localEmoji.trim() !== language.emoji
			)
		}, [language.emoji, language.name, localEmoji, localName])

		const metaInvalid = useMemo(() => {
			return !localName.trim() || !localEmoji.trim()
		}, [localEmoji, localName])

		const isSaveDisabled = useMemo(() => {
			return (!isDirty && !metaDirty) || metaInvalid || isSaving
		}, [isDirty, metaDirty, metaInvalid, isSaving])

		const renderHeader = useCallback(
			() => (
				<LanguageListItemHeader
					isDirty={isDirty}
					language={language}
					localEmoji={localEmoji}
					localName={localName}
				/>
			),
			[isDirty, language, localEmoji, localName],
		)

		useEffect(() => {
			setLocalName(language.name)
			setLocalEmoji(language.emoji)
		}, [language.name, language.emoji])

		return (
			<Accordion
				open={isExpanded}
				onOpenChange={onToggleHandler}
				className={expandedStyles}
				headerClassName={styles.langHeader}
				contentClassName={styles.langBody}
				header={renderHeader}
			>
				<LanguageListItemInputs
					language={language}
					localEmoji={localEmoji}
					localName={localName}
					setLocalEmoji={setLocalEmoji}
					setLocalName={setLocalName}
				/>

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
						disabled={isSaveDisabled}
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
			</Accordion>
		)
	},
)

export default LanguageListItem
