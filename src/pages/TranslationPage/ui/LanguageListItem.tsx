import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import Button from "@shared/Button/Button"
import { githubDarkTheme, JsonEditor } from "json-edit-react"
import cn from "classnames"
import styles from "../TranslationPage.module.scss"
import { useUpdateLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"
import { DirtyMap, DraftMap } from "../TranslationPage"
import Input from "@shared/Input/Input"
import { useToast } from "@shared/Toast/useToast"
import type {
	JsonValue,
	LanguageItem,
} from "@shared/api/services/languages/types"

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

		const metaDirty = useMemo(() => {
			return (
				localName.trim() !== language.name ||
				localEmoji.trim() !== language.emoji
			)
		}, [language.emoji, language.name, localEmoji, localName])

		const metaInvalid = useMemo(() => {
			return !localName.trim() || !localEmoji.trim()
		}, [localEmoji, localName])

		useEffect(() => {
			setLocalName(language.name)
			setLocalEmoji(language.emoji)
		}, [language.name, language.emoji])

		return (
			<article className={expandedStyles}>
				<button
					className={styles.langHeader}
					onClick={onToggleHandler}
					type='button'
				>
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
						<span className={chevronStyles} />
					</div>
				</button>

				<div className={styles.langBody}>
					<div className={styles.metaEdit}>
						<label className={styles.field}>
							<span className={styles.label}>Название</span>
							<Input
								value={localName}
								onChange={e => setLocalName(e.target.value)}
								placeholder={language.name}
							/>
						</label>
						<label className={styles.field}>
							<span className={styles.label}>Emoji</span>
							<Input
								value={localEmoji}
								onChange={e => setLocalEmoji(e.target.value)}
								placeholder={language.emoji}
							/>
						</label>
						<div className={styles.codeField}>
							<span className={styles.label}>Код языка</span>
							<div className={styles.codeValue}>
								{language.code.toUpperCase()}
							</div>
						</div>
					</div>
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
							disabled={(!isDirty && !metaDirty) || metaInvalid || isSaving}
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
