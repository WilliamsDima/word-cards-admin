import React, { useCallback, useEffect, useMemo, useState } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import Dropdown from "@shared/Dropdown/Dropdown"
import Input from "@shared/Input/Input"
import styles from "./UserProfileCards.module.scss"
import { useToast } from "@shared/Toast/useToast"
import {
	useCreateUserCardMutation,
	useUpdateUserCardMutation,
} from "@shared/api/services/cards/CardsQuery"
import type {
	CardStatus,
	UserCard,
} from "@shared/api/services/cards/types"
import type { LanguageItem } from "@shared/api/services/languages/types"
import UserProfileCardItemRow, {
	EditableCardItem,
} from "./UserProfileCardItemRow"

type Mode = "create" | "edit"

type LanguageOption = {
	label: string
	value: string
}

type FormState = {
	language: string
	description: string
	status: CardStatus
	items: EditableCardItem[]
}

type Props = {
	open: boolean
	mode: Mode
	userId: number | string
	card: UserCard | null
	languages: LanguageItem[]
	onClose: () => void
}

const createTempItemKey = () => {
	return `temp-${Date.now()}-${Math.random().toString(16).slice(2)}`
}

const createEmptyItem = (): EditableCardItem => {
	return {
		key: createTempItemKey(),
		word: "",
		translate: "",
	}
}

const buildItemsFromCard = (card: UserCard | null): EditableCardItem[] => {
	if (!card?.items?.length) return [createEmptyItem()]
	return card.items.map(item => ({
		key: String(item.id),
		word: item.word,
		translate: item.translate,
	}))
}

const UserProfileCardModal: React.FC<Props> = ({
	open,
	mode,
	userId,
	card,
	languages,
	onClose,
}) => {
	const [form, setForm] = useState<FormState>({
		language: "",
		description: "",
		status: "STUDY",
		items: [createEmptyItem()],
	})
	const [formError, setFormError] = useState<string | null>(null)

	const [createCard, { isLoading: isCreating }] =
		useCreateUserCardMutation()
	const [updateCard, { isLoading: isUpdating }] =
		useUpdateUserCardMutation()
	const toast = useToast()

	const languageOptions = useMemo<LanguageOption[]>(() => {
		return languages.map(language => ({
			label: `${language.emoji} ${language.name}`,
			value: language.code,
		}))
	}, [languages])

	const defaultLanguage = useMemo(() => {
		return languageOptions[0]?.value ?? ""
	}, [languageOptions])

	const selectedLanguage = useMemo<LanguageOption | undefined>(() => {
		return (
			languageOptions.find(option => option.value === form.language) ??
			languageOptions[0]
		)
	}, [form.language, languageOptions])

	const statusOptions = useMemo(
		() => [
			{ label: "В изучении", value: "STUDY" as CardStatus },
			{ label: "Готово", value: "READY" as CardStatus },
		],
		[],
	)

	const selectedStatus = useMemo(() => {
		return statusOptions.find(option => option.value === form.status)
	}, [form.status, statusOptions])

	const title = useMemo(() => {
		return mode === "create" ? "Создать карточку" : "Редактировать карточку"
	}, [mode])

	const submitLabel = useMemo(() => {
		if (mode === "create") return isCreating ? "Создание..." : "Создать"
		return isUpdating ? "Сохранение..." : "Сохранить"
	}, [isCreating, isUpdating, mode])

	const isSaving = useMemo(
		() => isCreating || isUpdating,
		[isCreating, isUpdating],
	)

	const hasEmptyItems = useMemo(() => {
		return form.items.some(item => {
			return item.word.trim().length === 0 || item.translate.trim().length === 0
		})
	}, [form.items])

	const canSubmit = useMemo(() => {
		return (
			form.language.trim().length > 0 &&
			form.items.length > 0 &&
			!hasEmptyItems
		)
	}, [form.items.length, form.language, hasEmptyItems])

	const isSubmitDisabled = useMemo(
		() => isSaving || !canSubmit,
		[canSubmit, isSaving],
	)

	const onCloseModal = useCallback(() => {
		onClose()
	}, [onClose])

	const onDescriptionChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const value = event.target.value
			setForm(prev => ({
				...prev,
				description: value,
			}))
			setFormError(null)
		},
		[],
	)

	const onLanguageSelect = useCallback((option: LanguageOption) => {
		setForm(prev => ({
			...prev,
			language: option.value,
		}))
		setFormError(null)
	}, [])

	const onStatusSelect = useCallback(
		(option: { value: CardStatus }) => {
			setForm(prev => ({
				...prev,
				status: option.value,
			}))
			setFormError(null)
		},
		[],
	)

	const onAddItem = useCallback(() => {
		setForm(prev => ({
			...prev,
			items: [...prev.items, createEmptyItem()],
		}))
		setFormError(null)
	}, [])

	const onItemChange = useCallback(
		(key: string, field: "word" | "translate", value: string) => {
			setForm(prev => ({
				...prev,
				items: prev.items.map(item =>
					item.key === key ? { ...item, [field]: value } : item,
				),
			}))
			setFormError(null)
		},
		[],
	)

	const onItemRemove = useCallback((key: string) => {
		setForm(prev => {
			const nextItems = prev.items.filter(item => item.key !== key)
			return {
				...prev,
				items: nextItems.length ? nextItems : [createEmptyItem()],
			}
		})
		setFormError(null)
	}, [])

	const onSubmit = useCallback(async () => {
		const language = form.language.trim()
		const description = form.description.trim()
		const items = form.items.map(item => ({
			word: item.word.trim(),
			translate: item.translate.trim(),
		}))

		if (!language || items.some(item => !item.word || !item.translate)) {
			setFormError("Заполните все поля")
			return
		}

		try {
			if (mode === "create") {
				await createCard({
					userId,
					language,
					description: description || undefined,
					status: form.status,
					items,
				}).unwrap()
				toast.success("Карточка создана", description || language)
			} else if (card) {
				await updateCard({
					userId,
					cardId: card.id,
					language,
					description: description || undefined,
					items,
				}).unwrap()
				toast.success("Карточка обновлена", description || language)
			}
			setFormError(null)
			onClose()
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null
			setFormError(serverError || "Не удалось сохранить карточку")
			toast.error(
				"Ошибка сохранения",
				serverError || "Не удалось сохранить карточку",
			)
		}
	}, [
		card,
		createCard,
		form.description,
		form.items,
		form.language,
		form.status,
		mode,
		onClose,
		toast,
		updateCard,
		userId,
	])

	useEffect(() => {
		if (!open) return

		const items = buildItemsFromCard(card)
		const nextLanguage = card?.language ?? defaultLanguage
		const nextStatus = card?.status ?? "STUDY"

		setForm({
			language: nextLanguage,
			description: card?.description ?? "",
			status: nextStatus,
			items,
		})
		setFormError(null)
	}, [card, defaultLanguage, open])

	return (
		<Modal
			open={open}
			onClose={onCloseModal}
			title={title}
			contentClassName={styles.modalContent}
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onCloseModal}>
						Отмена
					</Button>
					<Button
						className={styles.primaryBtn}
						onClick={onSubmit}
						disabled={isSubmitDisabled}
					>
						{submitLabel}
					</Button>
				</>
			}
		>
			<div className={styles.modalForm}>
				<label className={styles.field}>
					<span className={styles.label}>Язык</span>
					<Dropdown
						options={languageOptions}
						selected={selectedLanguage}
						onSelect={onLanguageSelect}
						labelKey='label'
						valueKey='value'
					/>
				</label>

				{mode === "create" ? (
					<label className={styles.field}>
						<span className={styles.label}>Статус</span>
						<Dropdown
							options={statusOptions}
							selected={selectedStatus}
							onSelect={onStatusSelect}
							labelKey='label'
							valueKey='value'
						/>
					</label>
				) : null}

				<label className={styles.field}>
					<span className={styles.label}>Описание</span>
					<Input
						placeholder='Например: Новые слова'
						value={form.description}
						onChange={onDescriptionChange}
					/>
				</label>

				<div className={styles.field}>
					<span className={styles.label}>Слова</span>
					<div className={styles.itemsEditor}>
						{form.items.map(item => (
							<UserProfileCardItemRow
								key={item.key}
								item={item}
								onChange={onItemChange}
								onRemove={onItemRemove}
								isDisabled={isSaving}
							/>
						))}
					</div>
					<Button
						type='button'
						className={styles.addItemBtn}
						onClick={onAddItem}
						disabled={isSaving}
					>
						Добавить слово
					</Button>
				</div>

				{formError ? <div className={styles.formError}>{formError}</div> : null}
			</div>
		</Modal>
	)
}

export default UserProfileCardModal
