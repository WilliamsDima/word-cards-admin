import React, { useCallback, useMemo, useState } from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import styles from "../TranslationPage.module.scss"
import { useCreateLanguageMutation } from "@shared/api/services/languages/LanguagesQuery"

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

	const canCreate = useMemo(
		() =>
			createForm.code.trim().length > 0 && createForm.name.trim().length > 0,
		[createForm],
	)

	const onChangeCreateForm = useCallback(
		(field: "code" | "name" | "emoji", value: string) => {
			setCreateForm(prev => ({
				...prev,
				[field]: value,
			}))
		},
		[],
	)

	const onCreate = useCallback(async () => {
		const code = createForm.code.trim().toLowerCase()
		const name = createForm.name.trim()
		const emoji = createForm.emoji.trim() || "🌍"

		if (!code || !name) return

		await createLanguage({
			code,
			name,
			emoji,
			json: {},
		}).unwrap()

		setCreateForm({ code: "", name: "", emoji: "" })
		setIsCreateOpen(false)
	}, [
		createForm.code,
		createForm.emoji,
		setCreateForm,
		setIsCreateOpen,
		createForm.name,
		createLanguage,
	])

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
					<input
						className={styles.input}
						placeholder='en'
						value={createForm.code}
						onChange={e => onChangeCreateForm("code", e.target.value)}
					/>
				</label>
				<label className={styles.field}>
					<span className={styles.label}>Название</span>
					<input
						className={styles.input}
						placeholder='English'
						value={createForm.name}
						onChange={e => onChangeCreateForm("name", e.target.value)}
					/>
				</label>
				<label className={styles.field}>
					<span className={styles.label}>Emoji</span>
					<input
						className={styles.input}
						placeholder='🌍'
						value={createForm.emoji}
						onChange={e => onChangeCreateForm("emoji", e.target.value)}
					/>
				</label>
			</div>
		</Modal>
	)
}

export default CreateLanguageModal
