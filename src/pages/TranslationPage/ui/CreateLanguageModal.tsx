import React, { useActionState, useCallback, useMemo, useState } from "react"
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

	const [createLanguage] = useCreateLanguageMutation()
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

	const [createError, createAction, isPending] = useActionState(
		async (_prevState: string | null) => {
			const code = normalizedCode
			const name = createForm.name.trim()
			const emoji = createForm.emoji.trim()

			if (!code || !name || !emoji) return "Заполните все поля"

			if (!isCodeAllowed) {
				toast.error("Ошибка добавления", "Код языка не поддерживается")
				return "Код языка не поддерживается"
			}

			try {
				await createLanguage({ code, name, emoji, json: {} }).unwrap()
				setCreateForm({ code: "", name: "", emoji: "" })
				setIsCreateOpen(false)
				toast.success("Язык добавлен", name)
				return null
			} catch (err) {
				const status =
					typeof (err as { status?: number })?.status === "number"
						? (err as { status?: number }).status
						: (err as { data?: { status?: number } })?.data?.status

				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null

				if (status === 409) {
					toast.error("Ошибка добавления", "Код языка уже существует")
					return "Код языка уже существует"
				}

				toast.error(
					"Ошибка добавления",
					serverError || "Не удалось создать язык",
				)
				return serverError || "Не удалось создать язык"
			}
		},
		null,
	)

	const formError = createError ?? codeValidationError

	const onChangeCreateForm = useCallback(
		(field: "code" | "name" | "emoji", value: string) => {
			setCreateForm(prev => ({ ...prev, [field]: value }))
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

	const onClose = useCallback(() => setIsCreateOpen(false), [setIsCreateOpen])

	const isCreateDisabled = !canCreate || isPending

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
						onClick={createAction}
						disabled={isCreateDisabled}
					>
						{isPending ? "Создание..." : "Создать"}
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
