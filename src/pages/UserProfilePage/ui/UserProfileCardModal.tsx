import React, { useActionState, useCallback, useEffect, useMemo, useState } from "react"
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
import {
	statusOptions,
	type CardStatus,
	type UserCard,
} from "@shared/api/services/cards/types"
import type { LanguageItem } from "@shared/api/services/languages/types"
import UserProfileCardItemRow, {
	EditableCardItem,
} from "./UserProfileCardItemRow"
import { useParams } from "react-router-dom"
import { Icon } from "@assets/icons/Icon"
import { dateService } from "@shared/lib/date"

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
	card: UserCard | null
	languages: LanguageItem[]
	onClose: () => void
}

const createTempItemKey = () => {
	return `temp-${dateService.getTimestamp()}-${Math.random().toString(16).slice(2)}`
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
	card,
	languages,
	onClose,
}) => {
	const { id } = useParams()

	const [form, setForm] = useState<FormState>({
		language: "",
		description: "",
		status: "STUDY",
		items: [createEmptyItem()],
	})

	const [createCard] = useCreateUserCardMutation()
	const [updateCard] = useUpdateUserCardMutation()
	const toast = useToast()

	const [formError, submitAction, isPending] = useActionState(
		async (_prevState: string | null) => {
			if (!id) return null
			const language = form.language.trim()
			const description = form.description.trim()
			const items = form.items.map(item => ({
				word: item.word.trim(),
				translate: item.translate.trim(),
			}))

			if (!language || items.some(item => !item.word || !item.translate)) {
				return "Заполните все поля"
			}

			try {
				if (mode === "create") {
					await createCard({
						userId: id,
						language,
						description: description || undefined,
						status: form.status,
						items,
					}).unwrap()
					toast.success("Карточка создана", description || language)
				} else if (card) {
					await updateCard({
						userId: id,
						cardId: card.id,
						language,
						description: description || undefined,
						items,
					}).unwrap()
					toast.success("Карточка обновлена", description || language)
				}
				onClose()
				return null
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось сохранить карточку",
				)
				return serverError || "Не удалось сохранить карточку"
			}
		},
		null,
	)

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

	const selectedStatus = useMemo(() => {
		return statusOptions.find(option => option.value === form.status)
	}, [form.status])

	const title = useMemo(() => {
		return mode === "create" ? "Создать карточку" : "Редактировать карточку"
	}, [mode])

	const submitLabel = useMemo(() => {
		if (!isPending) return mode === "create" ? "Создать" : "Сохранить"
		return mode === "create" ? "Создание..." : "Сохранение..."
	}, [isPending, mode])

	const hasEmptyItems = useMemo(() => {
		return form.items.some(item => {
			return item.word.trim().length === 0 || item.translate.trim().length === 0
		})
	}, [form.items])

	const canSubmit = useMemo(() => {
		return (
			form.language.trim().length > 0 && form.items.length > 0 && !hasEmptyItems
		)
	}, [form.items.length, form.language, hasEmptyItems])

	const isSubmitDisabled = isPending || !canSubmit

	const onCloseModal = useCallback(() => {
		onClose()
	}, [onClose])

	const onDescriptionChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			setForm(prev => ({ ...prev, description: event.target.value }))
		},
		[],
	)

	const onLanguageSelect = useCallback((option: LanguageOption) => {
		setForm(prev => ({ ...prev, language: option.value }))
	}, [])

	const onStatusSelect = useCallback((option: { value: CardStatus }) => {
		setForm(prev => ({ ...prev, status: option.value }))
	}, [])

	const onAddItem = useCallback(() => {
		setForm(prev => ({ ...prev, items: [...prev.items, createEmptyItem()] }))
	}, [])

	const onItemChange = useCallback(
		(key: string, field: "word" | "translate", value: string) => {
			setForm(prev => ({
				...prev,
				items: prev.items.map(item =>
					item.key === key ? { ...item, [field]: value } : item,
				),
			}))
		},
		[],
	)

	const onItemRemove = useCallback((key: string) => {
		setForm(prev => {
			const nextItems = prev.items.filter(item => item.key !== key)
			return { ...prev, items: nextItems.length ? nextItems : [createEmptyItem()] }
		})
	}, [])

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
	}, [card, defaultLanguage, open])

	return (
		<Modal
			open={open}
			onClose={onCloseModal}
			title={title}
			contentClassName={styles.modalContent}
			className={styles.modal}
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onCloseModal}>
						Отмена
					</Button>
					<Button
						className={styles.primaryBtn}
						onClick={submitAction}
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
								isDisabled={isPending}
							/>
						))}
					</div>
					<button
						className={styles.addItemBtn}
						onClick={onAddItem}
						disabled={isPending}
					>
						<Icon kind='svg' name='add-square-white' width={20} height={20} />
					</button>
				</div>

				{formError ? <div className={styles.formError}>{formError}</div> : null}
			</div>
		</Modal>
	)
}

export default UserProfileCardModal
