import React, { useCallback, useEffect, useMemo, useState } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "../TranslationPage.module.scss"
import { useCreateLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"
import Input from "@shared/Input/Input"

type Props = {
	open: boolean
	setIsCreateOpen: React.Dispatch<React.SetStateAction<boolean>>
}

const CreateLanguageModal: React.FC<Props> = ({ open, setIsCreateOpen }) => {
	const [createLanguage, { isLoading: isCreating }] =
		useCreateLanguageMutation()

	const [createForm, setCreateForm] = useState({
		code: "",
		name: "",
		emoji: "",
	})
	const [createError, setCreateError] = useState<string | null>(null)

	useEffect(() => {
		if (!open) {
			setCreateError(null)
		}
	}, [open])

	const canCreate = useMemo(
		() =>
			createForm.code.trim().length > 0 &&
			createForm.name.trim().length > 0 &&
			createForm.emoji.trim().length > 0,
		[createForm],
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

	const onCreate = useCallback(async () => {
		const code = createForm.code.trim().toLowerCase()
		const name = createForm.name.trim()
		const emoji = createForm.emoji.trim()

		if (!code || !name || !emoji) {
			setCreateError("Заполните все поля")
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
				return
			}

			setCreateError(serverError || "Не удалось создать язык")
		}
	}, [createForm.code, createForm.emoji, createForm.name, createLanguage, setIsCreateOpen])

	const onClose = () => setIsCreateOpen(false)

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
						disabled={!canCreate || isCreating}
					>
						{isCreating ? "Создание..." : "Создать"}
					</Button>
				</>
			}
		>
			<div className={styles.modalForm}>
				<label className={styles.field}>
					<span className={styles.label}>Код языка</span>
					<Input
						placeholder='en'
						value={createForm.code}
						onChange={e => onChangeCreateForm("code", e.target.value)}
					/>
				</label>
				<label className={styles.field}>
					<span className={styles.label}>Название</span>
					<Input
						placeholder='English'
						value={createForm.name}
						onChange={e => onChangeCreateForm("name", e.target.value)}
					/>
				</label>
				<label className={styles.field}>
					<span className={styles.label}>Emoji</span>
					<Input
						placeholder='🌍'
						value={createForm.emoji}
						onChange={e => onChangeCreateForm("emoji", e.target.value)}
					/>
				</label>
				{createError ? (
					<div className={styles.formError}>{createError}</div>
				) : null}
			</div>
		</Modal>
	)
}

export default CreateLanguageModal
