import React, { useCallback, useMemo, useState } from "react"
import styles from "./UserProfileCards.module.scss"
import Search from "@shared/Search/Search"
import Dropdown from "@shared/Dropdown/Dropdown"
import Checkbox from "@shared/Checkbox/Checkbox"
import Button from "@shared/Button/Button"
import type { CardStatus } from "@shared/api/services/cards/types"
import type { LanguageItem } from "@shared/api/services/languages/types"

type StatusFilter = CardStatus | "ALL"

type StatusOption = {
	label: string
	value: StatusFilter
}

type Props = {
	search: string
	onSearchChange: (value: string) => void
	status: StatusFilter
	onStatusChange: (value: StatusFilter) => void
	languages: LanguageItem[]
	selectedLanguages: string[]
	isLanguagesLoading: boolean
	onToggleLanguage: (event: React.ChangeEvent<HTMLInputElement>) => void
	onClearLanguages: () => void
}

const UserProfileCardsFilters: React.FC<Props> = ({
	search,
	onSearchChange,
	status,
	onStatusChange,
	languages,
	selectedLanguages,
	isLanguagesLoading,
	onToggleLanguage,
	onClearLanguages,
}) => {
	const [isLanguagesOpen, setIsLanguagesOpen] = useState(false)

	const statusOptions = useMemo<StatusOption[]>(
		() => [
			{ label: "Все статусы", value: "ALL" },
			{ label: "В изучении", value: "STUDY" },
			{ label: "Готово", value: "READY" },
		],
		[],
	)

	const selectedStatus = useMemo<StatusOption>(() => {
		return (
			statusOptions.find(option => option.value === status) ?? statusOptions[0]
		)
	}, [status, statusOptions])

	const selectedLanguageSet = useMemo(() => {
		return new Set(selectedLanguages)
	}, [selectedLanguages])

	const showClearLanguages = useMemo(
		() => selectedLanguages.length > 0,
		[selectedLanguages.length],
	)

	const languagesLabel = useMemo(() => {
		if (selectedLanguages.length === 0) return "Все языки"
		if (selectedLanguages.length === 1) return "Выбран 1 язык"
		return `Выбрано языков: ${selectedLanguages.length}`
	}, [selectedLanguages.length])

	const languagesButtonClassName = useMemo(
		() =>
			isLanguagesOpen
				? styles.languagesButtonActive
				: styles.languagesButton,
		[isLanguagesOpen],
	)

	const languagesPanelClassName = useMemo(
		() =>
			isLanguagesOpen ? styles.languagesPanelOpen : styles.languagesPanel,
		[isLanguagesOpen],
	)

	const onSearchInputChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onSearchChange(event.target.value)
		},
		[onSearchChange],
	)

	const onStatusSelect = useCallback(
		(option: StatusOption) => {
			onStatusChange(option.value)
		},
		[onStatusChange],
	)

	const onToggleLanguages = useCallback(() => {
		setIsLanguagesOpen(prev => !prev)
	}, [])

	return (
		<div className={styles.filters}>
			<div className={styles.filtersRow}>
				<Search
					value={search}
					onChange={onSearchInputChange}
					className={styles.searchInput}
					classnames={{ inputWrapper: styles.searchWrapper }}
					placeholder='Поиск по словам или переводу'
				/>
				<div className={styles.dropdown}>
					<Dropdown
						options={statusOptions}
						selected={selectedStatus}
						onSelect={onStatusSelect}
						labelKey='label'
						valueKey='value'
					/>
				</div>
				<div className={styles.languagesSelect}>
					<button
						type='button'
						className={languagesButtonClassName}
						onClick={onToggleLanguages}
					>
						{languagesLabel}
					</button>
					{isLanguagesOpen ? (
						<div className={languagesPanelClassName}>
							{isLanguagesLoading ? (
								<div className={styles.empty}>Загружаем языки...</div>
							) : languages.length ? (
								<div className={styles.languagesList}>
									{languages.map(language => (
										<Checkbox
											key={language.id}
											className={styles.languageItem}
											inputClassName={styles.languageCheckbox}
											value={language.code}
											checked={selectedLanguageSet.has(language.code)}
											onChange={onToggleLanguage}
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
							) : (
								<div className={styles.empty}>
									Нет доступных языков для фильтра
								</div>
							)}
						</div>
					) : null}
				</div>
				{showClearLanguages ? (
					<Button className={styles.ghostBtn} onClick={onClearLanguages}>
						Сбросить языки
					</Button>
				) : null}
			</div>
		</div>
	)
}

export default UserProfileCardsFilters
