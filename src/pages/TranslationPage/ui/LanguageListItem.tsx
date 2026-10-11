import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
import Button from "@shared/Button/Button"
import {
	githubDarkTheme,
	JsonEditor,
	type OnEditEventFunction,
} from "json-edit-react"
import cn from "classnames"
import styles from "../TranslationPage.module.scss"
import { useUpdateLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"
import type { DirtyMap, DraftMap } from "../TranslationPage"
import { useToast } from "@shared/Toast/useToast"
import type {
	JsonValue,
	LanguageItem,
} from "@shared/api/services/languages/types"
import { isTranslationKey } from "@shared/api/services/languages/types"
import Accordion from "@shared/Accordion/Accordion"
import LanguageListItemInputs from "./LanguageListItemInputs"
import LanguageListItemHeader from "./LanguageListItemHeader"
import LanguageJsonEditToolbar from "./LanguageJsonEditToolbar"

// Внутренние кнопки подтверждения json-edit-react (✓ / ✕) у активного редактирования.
// Внешние триггеры библиотеки не умеют подтверждать правку обычных значений,
// поэтому кликаем по её собственным кнопкам — так сохраняется вся её валидация.
const JSON_CONFIRM_BUTTONS_SELECTOR = ".jer-confirm-buttons > div"

const clickJsonEditorButton = (
	container: HTMLElement | null,
	action: "ok" | "cancel",
) => {
	const buttons = container?.querySelectorAll<HTMLElement>(
		JSON_CONFIRM_BUTTONS_SELECTOR,
	)
	if (!buttons?.length) return false
	if (action === "ok") {
		// Если библиотека спрятала «ок» (пустой новый ключ) — остаётся только «отмена»
		if (buttons.length < 2) return true
		buttons[0].click()
		return true
	}
	buttons[buttons.length - 1].click()
	return true
}

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
		const [localName, setLocalName] = useState(language.name)
		const [localEmoji, setLocalEmoji] = useState(language.emoji)
		const [isEditingJson, setIsEditingJson] = useState(false)
		const editorWrapRef = useRef<HTMLDivElement | null>(null)

		const [updateLanguage, { isLoading: isSaving }] =
			useUpdateLanguageMutation()
		const toast = useToast()

		const expandedStyles = useMemo(
			() =>
				cn(styles.langCard, {
					[styles.expanded]: isExpanded,
				}),
			[isExpanded],
		)

		const isCodeAllowed = useMemo(
			() => isTranslationKey(language.code),
			[language.code],
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
			return (
				(!isDirty && !metaDirty) ||
				metaInvalid ||
				isSaving ||
				!isCodeAllowed ||
				isEditingJson
			)
		}, [isCodeAllowed, isDirty, metaDirty, metaInvalid, isSaving, isEditingJson])

		const saveHint = useMemo(() => {
			if (isSaving) return null
			if (isEditingJson) {
				return "Сначала примените или отмените правку JSON (кнопки над редактором)"
			}
			if (!isCodeAllowed) return "Код языка не поддерживается"
			if (metaInvalid) return "Заполните название и emoji"
			if (!isDirty && !metaDirty) return "Нет изменений для сохранения"
			return null
		}, [isCodeAllowed, isDirty, isEditingJson, isSaving, metaDirty, metaInvalid])

		const onSave = useCallback(
			async (language: LanguageItem) => {
				if (!isCodeAllowed) {
					toast.error("Ошибка обновления", "Код языка не поддерживается")
					return
				}
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
			[
				drafts,
				updateLanguage,
				setDirtyMap,
				localEmoji,
				localName,
				toast,
				isCodeAllowed,
			],
		)

		const onDelete = useCallback(
			(language: LanguageItem) => {
				setDeleteTarget(language)
			},
			[setDeleteTarget],
		)

		const onDeleteHandler = useCallback(() => onDelete(language), [language, onDelete])
		const onResetHandler = useCallback(() => onReset(language), [language, onReset])
		const onSaveHandler = useCallback(() => onSave(language), [language, onSave])
		const onChangeJsonHandler = useCallback(
			(value: unknown) => onChangeJson(language.code, value),
			[language.code, onChangeJson],
		)
		const onToggleHandler = useCallback(
			() => onToggle(language.code),
			[language.code, onToggle],
		)

		const onJsonEditEvent = useCallback<OnEditEventFunction>(path => {
			setIsEditingJson(path !== null)
		}, [])

		const onApplyJson = useCallback(() => {
			if (!clickJsonEditorButton(editorWrapRef.current, "ok")) {
				setIsEditingJson(false)
			}
		}, [])

		const onCancelJson = useCallback(() => {
			if (!clickJsonEditorButton(editorWrapRef.current, "cancel")) {
				setIsEditingJson(false)
			}
		}, [])

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

				{isEditingJson ? (
					<LanguageJsonEditToolbar
						onApply={onApplyJson}
						onCancel={onCancelJson}
					/>
				) : (
					<></>
				)}

				<div className={styles.editorWrap} ref={editorWrapRef}>
					<JsonEditor
						data={draft}
						setData={onChangeJsonHandler}
						onEditEvent={onJsonEditEvent}
						rootName=''
						showArrayIndices={false}
						showCollectionCount={false}
						theme={[githubDarkTheme]}
						maxWidth='100%'
						minWidth='100%'
						className={styles.jsonEditor}
					/>
				</div>

				<div className={styles.actionsRow}>
					{saveHint ? (
						<span className={styles.saveHint}>{saveHint}</span>
					) : (
						<></>
					)}
					<div className={styles.actions}>
						<Button
							className={styles.primaryBtn}
							disabled={isSaveDisabled}
							onClick={onSaveHandler}
							title={saveHint ?? undefined}
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
			</Accordion>
		)
	},
)

export default LanguageListItem
