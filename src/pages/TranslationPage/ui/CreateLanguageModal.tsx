import React, { useCallback, useEffect, useMemo, useState } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "../TranslationPage.module.scss"
import { useCreateLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"
import { useToast } from "@shared/Toast/useToast"
import Input from "@shared/Input/Input"
import {
	isTranslationKey,
	TRANSLATION_KEYS,
} from "@shared/api/services/languages/types"
import Tooltip from "@shared/Tooltip/Tooltip"

type Props = {
	open: boolean
	setIsCreateOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateLanguageModal: React.FC<Props> = ({ open, setIsCreateOpen }) => {
	const [createForm, setCreateForm] = useState({
		code: "",
		name: "",
		emoji: "",
	})
	const [createError, setCreateError] = useState<string | null>(null)

	const [createLanguage, { isLoading: isCreating }] =
		useCreateLanguageMutation()
	const toast = useToast()

	const normalizedCode = useMemo(
		() => createForm.code.trim().toLowerCase(),
		[createForm.code],
	)
	const translationKeysText = useMemo(
		() => `Доступные коды: ${TRANSLATION_KEYS.join(", ")}`,
		[],
	)
	const isCodeAllowed = useMemo(
		() => isTranslationKey(normalizedCode),
		[normalizedCode],
	)
	const canCreate = useMemo(
		() =>
			normalizedCode.length > 0 &&
			isCodeAllowed &&
			createForm.name.trim().length > 0 &&
			createForm.emoji.trim().length > 0,
		[createForm.emoji, createForm.name, isCodeAllowed, normalizedCode],
	)
	const codeValidationError = useMemo(() => {
		if (!normalizedCode.length) return null
		if (isCodeAllowed) return null
		return "Код языка не поддерживается"
	}, [isCodeAllowed, normalizedCode])
	const formError = useMemo(
		() => createError ?? codeValidationError,
		[codeValidationError, createError],
	)

	const onChangeCreateForm = useCallback(
		(field: "code" | "name" | "emoji", value: string) => {
			setCreateForm(prev => ({
				...prev,
				[field]: value,
			}))
			setCreateError(null)
		},
		[],
	)

	const onChangeCode = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeCreateForm("code", e.target.value),
		[onChangeCreateForm],
	)

	const onChangeName = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeCreateForm("name", e.target.value),
		[onChangeCreateForm],
	)

	const onChangeEmoji = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeCreateForm("emoji", e.target.value),
		[onChangeCreateForm],
	)

	const onCreate = useCallback(async () => {
		const code = normalizedCode
		const name = createForm.name.trim()
		const emoji = createForm.emoji.trim()

		if (!code || !name || !emoji) {
			setCreateError("Заполните все поля")
			return
		}

		if (!isCodeAllowed) {
			setCreateError("Код языка не поддерживается")
			toast.error("Ошибка добавления", "Код языка не поддерживается")
			return
		}

		try {
			await createLanguage({
				code,
				name,
				emoji,
				json: {},
			}).unwrap()

			setCreateForm({ code: "", name: "", emoji: "" })
			setCreateError(null)
			setIsCreateOpen(false)
			toast.success("Язык добавлен", name)
		} catch (err) {
			const status =
				typeof (err as { status?: number })?.status === "number"
					? (err as { status?: number }).status
					: (err as { data?: { status?: number } })?.data?.status

			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null

			if (status === 409) {
				setCreateError("Код языка уже существует")
				toast.error("Ошибка добавления", "Код языка уже существует")
				return
			}

			setCreateError(serverError || "Не удалось создать язык")
			toast.error("Ошибка добавления", serverError || "Не удалось создать язык")
		}
	}, [
		createForm.emoji,
		createForm.name,
		createLanguage,
		isCodeAllowed,
		normalizedCode,
		setIsCreateOpen,
		toast,
	])

	const onClose = useCallback(() => setIsCreateOpen(false), [setIsCreateOpen])

	const isCreateDisabled = useMemo(
		() => !canCreate || isCreating,
		[canCreate, isCreating],
	)

	useEffect(() => {
		if (!open) {
			setCreateError(null)
		}
	}, [open])

	return (
		<Modal
			open={open}
			onClose={onClose}
			title='Добавить язык'
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onClose}>
						Отмена
					</Button>
					<Button
						className={styles.primaryBtn}
						onClick={onCreate}
						disabled={isCreateDisabled}
					>
						{isCreating ? "Создание..." : "Создать"}
					</Button>
				</>
			}
		>
			<div className={styles.modalForm}>
				<label className={styles.field}>
					<span className={styles.labelRow}>
						<span className={styles.label}>Код языка</span>
						<Tooltip>{translationKeysText}</Tooltip>
					</span>
					<Input
						placeholder='en'
						value={createForm.code}
						onChange={onChangeCode}
					/>
				</label>
				<label className={styles.field}>
					<span className={styles.label}>Название</span>
					<Input
						placeholder='English'
						value={createForm.name}
						onChange={onChangeName}
					/>
				</label>
				<label className={styles.field}>
					<span className={styles.label}>Emoji</span>
					<Input
						placeholder='🌍'
						value={createForm.emoji}
						onChange={onChangeEmoji}
					/>
				</label>
				{formError ? (
					<div className={styles.formError}>{formError}</div>
				) : null}
			</div>
		</Modal>
	)
}

export default CreateLanguageModal
