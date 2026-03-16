import React, { useCallback, useEffect, useMemo, useState } from "react"
import styles from "./UserProfileLanguagesCard.module.scss"
import { useGetLanguagesQuery } from "@shared/api/services/languages/LanguagesQuery"
import { useUpdateUserLanguagesMutation } from "@entities/api/users/UsersQuery"
import { useToast } from "@shared/Toast/useToast"
import Card from "@shared/Card/Card"
import Button from "@shared/Button/Button"
import Checkbox from "@shared/Checkbox/Checkbox"
import type { LanguageItem } from "@shared/api/services/languages/types"
import type { IUser } from "@entities/api/users/types"

type UserProfileLanguagesCardProps = {
	user: IUser | undefined
	onValueChange?: (value: string) => void
}

const isLanguageItem = (item: LanguageItem | undefined): item is LanguageItem =>
	Boolean(item)

const UserProfileLanguagesCard = ({
	user,
	onValueChange,
}: UserProfileLanguagesCardProps) => {
	const [selectedLanguageIds, setSelectedLanguageIds] = useState<number[]>([])

	const { data: languagesMap, isLoading: isLanguagesLoading } =
		useGetLanguagesQuery()
	const [updateUserLanguages, { isLoading: isUpdating }] =
		useUpdateUserLanguagesMutation()
	const toast = useToast()

	const languages = useMemo(() => {
		return languagesMap
			? Object.values(languagesMap).sort((a, b) => a.name.localeCompare(b.name))
			: []
	}, [languagesMap])

	const selectedLanguageSet = useMemo(() => {
		return new Set(selectedLanguageIds)
	}, [selectedLanguageIds])

	const selectedLanguages = useMemo(() => {
		if (!selectedLanguageIds.length || !languagesMap) return []
		const allLanguages = Object.values(languagesMap)

		return selectedLanguageIds
			.map(languageId =>
				allLanguages.find(language => language.id === languageId),
			)
			.filter(isLanguageItem)
	}, [languagesMap, selectedLanguageIds])

	const languagesValue = useMemo(() => {
		if (!selectedLanguageIds.length) return "Нет языков"
		if (isLanguagesLoading && !languagesMap) return "Загружаем..."
		if (!languagesMap) return "Нет данных"

		const languageNames = selectedLanguages.map(language => language.name)

		return languageNames.length ? languageNames.join(", ") : "Нет данных"
	}, [
		isLanguagesLoading,
		languagesMap,
		selectedLanguageIds.length,
		selectedLanguages,
	])

	const isDirty = useMemo(() => {
		const baseLanguages = user?.languages ?? []
		if (baseLanguages.length !== selectedLanguageIds.length) return true
		if (!baseLanguages.length) return false

		const sortedInitial = [...baseLanguages].sort((a, b) => a - b)
		const sortedSelected = [...selectedLanguageIds].sort((a, b) => a - b)

		return sortedInitial.some((languageId, index) => {
			return languageId !== sortedSelected[index]
		})
	}, [user, selectedLanguageIds])

	const isSaveDisabled = useMemo(() => {
		return !user || !isDirty || isUpdating
	}, [isDirty, isUpdating, user])

	const saveButtonLabel = useMemo(() => {
		return isUpdating ? "Сохраняем..." : "Сохранить"
	}, [isUpdating])

	const onToggleLanguage = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const languageId = Number(event.target.value)
			if (Number.isNaN(languageId)) return

			setSelectedLanguageIds(prev =>
				prev.includes(languageId)
					? prev.filter(id => id !== languageId)
					: [...prev, languageId],
			)
		},
		[],
	)

	const onSaveLanguages = useCallback(async () => {
		if (!user) return

		try {
			await updateUserLanguages({
				id: user.id,
				languages: selectedLanguageIds,
			}).unwrap()
			toast.success("Языки сохранены", "Список обновлён")
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null
			toast.error(
				"Ошибка сохранения",
				serverError || "Не удалось сохранить языки",
			)
		}
	}, [user, selectedLanguageIds, toast, updateUserLanguages])

	const renderLanguageOptions = useCallback(() => {
		if (isLanguagesLoading && !languagesMap) {
			return <div className={styles.languagesEmpty}>Загружаем языки...</div>
		}

		if (!languagesMap) {
			return <div className={styles.languagesEmpty}>Нет данных по языкам</div>
		}

		if (!languages.length) {
			return <div className={styles.languagesEmpty}>Нет доступных языков</div>
		}

		return (
			<div className={styles.languagesList}>
				{languages.map(language => (
					<Checkbox
						key={language.id}
						className={styles.languageItem}
						inputClassName={styles.languageCheckbox}
						value={language.id}
						checked={selectedLanguageSet.has(language.id)}
						onChange={onToggleLanguage}
						disabled={isUpdating}
					>
						<span className={styles.languageName}>
							{language.emoji} {language.name}
						</span>
						<span className={styles.languageCode}>
							{language.code.toUpperCase()}
						</span>
					</Checkbox>
				))}
			</div>
		)
	}, [
		isLanguagesLoading,
		isUpdating,
		languages,
		languagesMap,
		onToggleLanguage,
		selectedLanguageSet,
	])

	useEffect(() => {
		if (!user) return
		setSelectedLanguageIds(user.languages)
	}, [user])

	useEffect(() => {
		onValueChange?.(languagesValue)
	}, [languagesValue, onValueChange])

	return (
		<Card className={styles.languagesCard}>
			<div className={styles.languagesHeader}>
				<div className={styles.languagesHeaderText}>
					<h2 className={styles.languagesTitle}>Языки профиля</h2>
					<p className={styles.languagesHint}>
						Выберите языки, которые изучает пользователь, и сохраните результат.
					</p>
				</div>
				<Button onClick={onSaveLanguages} disabled={isSaveDisabled}>
					{saveButtonLabel}
				</Button>
			</div>

			{renderLanguageOptions()}
		</Card>
	)
}

export default UserProfileLanguagesCard
