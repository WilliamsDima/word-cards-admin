import React, { useCallback, useMemo } from "react"
import styles from "./UserProfileCards.module.scss"
import Search from "@shared/Search/Search"
import Dropdown from "@shared/Dropdown/Dropdown"
import type { LanguageItem } from "@shared/api/services/languages/types"
import DropdownMultiselect from "@shared/Dropdown/DropdownMultiselect"
import type { StatusFilter } from "./UserProfileCards"
import { statusOptions } from "@shared/api/services/cards/types"

type StatusOption = {
	label: string
	value: StatusFilter
}

const options: StatusOption[] = [
	{ label: "Все статусы", value: undefined },
	...statusOptions,
]

type Props = {
	search: string
	onSearchChange: (value: string) => void
	status?: StatusFilter
	onStatusChange: (value: StatusFilter | undefined) => void
	languages: LanguageItem[]
	selectedLanguages: string[]
	isLanguagesLoading: boolean
	onLanguagesChange: (next: string[]) => void
}

const UserProfileCardsFilters: React.FC<Props> = ({
	search,
	onSearchChange,
	status,
	onStatusChange,
	languages,
	selectedLanguages,
	isLanguagesLoading,
	onLanguagesChange,
}) => {
	const selectedStatus = useMemo<StatusOption>(() => {
		return options.find(option => option.value === status) ?? options[0]
	}, [status])

	const selectedLanguageSet = useMemo(() => {
		return new Set(selectedLanguages)
	}, [selectedLanguages])

	const selectedLanguageItems = useMemo(() => {
		return languages.filter(language => selectedLanguageSet.has(language.code))
	}, [languages, selectedLanguageSet])

	const languagesLabel = useMemo(() => {
		if (selectedLanguages.length === 0) return "Все языки"
		if (selectedLanguages.length === 1) return "Выбран 1 язык"
		return `Выбрано языков: ${selectedLanguages.length}`
	}, [selectedLanguages.length])

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

	const onLanguagesSelect = useCallback(
		(next: LanguageItem[]) => {
			onLanguagesChange(next.map(item => item.code))
		},
		[onLanguagesChange],
	)

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
						options={options}
						selected={selectedStatus}
						onSelect={onStatusSelect}
						labelKey='label'
						valueKey='value'
					/>
				</div>
				<div className={styles.languagesSelect}>
					<DropdownMultiselect
						options={languages}
						selected={selectedLanguageItems}
						onChange={onLanguagesSelect}
						labelKey='name'
						valueKey='code'
						placeholder='Все языки'
						selectedLabel={languagesLabel}
						emptyLabel={
							isLanguagesLoading ? "Загружаем языки..." : "Нет доступных языков"
						}
					/>
				</div>
			</div>
		</div>
	)
}

export default UserProfileCardsFilters
