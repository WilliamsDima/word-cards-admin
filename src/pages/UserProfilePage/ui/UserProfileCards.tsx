import React, { useCallback, useEffect, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileCards.module.scss"
import Card from "@shared/Card/Card"
import Button from "@shared/Button/Button"
import { useDebounce } from "@shared/hooks/useDebounce"
import { useGetLanguagesQuery } from "@shared/api/services/languages/LanguagesQuery"
import { useGetUserCardsQuery } from "@shared/api/services/cards/CardsQuery"
import type { CardStatus, UserCard } from "@shared/api/services/cards/types"
import type { LanguageItem } from "@shared/api/services/languages/types"
import UserProfileCardsFilters from "./UserProfileCardsFilters"
import UserProfileCardsList from "./UserProfileCardsList"
import UserProfileCardsPagination from "./UserProfileCardsPagination"
import UserProfileCardModal from "./UserProfileCardModal"
import UserProfileCardDeleteModal from "./UserProfileCardDeleteModal"

type StatusFilter = CardStatus | "ALL"

const DEFAULT_LIMIT = 20

const UserProfileCards: React.FC = () => {
	const { id } = useParams()

	const [search, setSearch] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")
	const [statusFilter, setStatusFilter] = useState<StatusFilter>("ALL")
	const [selectedLanguages, setSelectedLanguages] = useState<string[]>([])
	const [offset, setOffset] = useState(0)
	const [isCreateOpen, setIsCreateOpen] = useState(false)
	const [editTarget, setEditTarget] = useState<UserCard | null>(null)
	const [deleteTarget, setDeleteTarget] = useState<UserCard | null>(null)

	const { data: languagesMap, isLoading: isLanguagesLoading } =
		useGetLanguagesQuery()

	const { data: cardsData, isLoading, isFetching } = useGetUserCardsQuery(
		{
			userId: id ?? "",
			search: debouncedSearch.trim() || undefined,
			status: statusFilter === "ALL" ? undefined : statusFilter,
			languages: selectedLanguages.length ? selectedLanguages : undefined,
			limit: DEFAULT_LIMIT,
			offset,
		},
		{
			skip: !id,
		},
	)

	const debounceSearch = useDebounce((value: string) => {
		setDebouncedSearch(value)
	}, 400)

	const userId = useMemo(() => id ?? "", [id])

	const normalizedSearch = useMemo(() => debouncedSearch.trim(), [debouncedSearch])

	const languages = useMemo<LanguageItem[]>(() => {
		return languagesMap
			? Object.values(languagesMap).sort((a, b) => a.name.localeCompare(b.name))
			: []
	}, [languagesMap])

	const languageByCode = useMemo<Record<string, LanguageItem>>(() => {
		return languages.reduce<Record<string, LanguageItem>>((acc, language) => {
			acc[language.code] = language
			return acc
		}, {})
	}, [languages])

	const cards = useMemo(() => cardsData?.items ?? [], [cardsData])
	const total = useMemo(() => cardsData?.total ?? 0, [cardsData])
	const isListLoading = useMemo(
		() => isLoading || isFetching,
		[isFetching, isLoading],
	)

	const isCreateDisabled = useMemo(() => {
		return !userId || languages.length === 0
	}, [languages.length, userId])

	const isPaginationVisible = useMemo(() => total > DEFAULT_LIMIT, [total])

	const onSearchChange = useCallback(
		(value: string) => {
			setSearch(value)
			debounceSearch(value)
		},
		[debounceSearch],
	)

	const onStatusChange = useCallback((value: StatusFilter) => {
		setStatusFilter(value)
	}, [])

	const onToggleLanguage = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const code = String(event.target.value)
			if (!code) return
			setSelectedLanguages(prev =>
				prev.includes(code) ? prev.filter(item => item !== code) : [...prev, code],
			)
		},
		[],
	)

	const onClearLanguages = useCallback(() => {
		setSelectedLanguages([])
	}, [])

	const onOpenCreate = useCallback(() => {
		setIsCreateOpen(true)
	}, [])

	const onCloseCreate = useCallback(() => {
		setIsCreateOpen(false)
	}, [])

	const onOpenEdit = useCallback((card: UserCard) => {
		setEditTarget(card)
	}, [])

	const onCloseEdit = useCallback(() => {
		setEditTarget(null)
	}, [])

	const onOpenDelete = useCallback((card: UserCard) => {
		setDeleteTarget(card)
	}, [])

	const onCloseDelete = useCallback(() => {
		setDeleteTarget(null)
	}, [])

	const onPageChange = useCallback((page: number) => {
		setOffset((page - 1) * DEFAULT_LIMIT)
	}, [])

	useEffect(() => {
		setOffset(0)
	}, [normalizedSearch, selectedLanguages, statusFilter, userId])

	return (
		<Card className={styles.cardsCard}>
			<div className={styles.cardsHeader}>
				<div className={styles.cardsHeaderText}>
					<h2 className={styles.cardsTitle}>Карточки пользователя</h2>
					<p className={styles.cardsHint}>
						Управляйте карточками, созданными пользователем: создавайте новые,
						редактируйте содержимое и следите за статусами.
					</p>
				</div>
				<div className={styles.actionsRow}>
					<Button
						className={styles.primaryBtn}
						onClick={onOpenCreate}
						disabled={isCreateDisabled}
					>
						Создать карточку
					</Button>
				</div>
			</div>

			<UserProfileCardsFilters
				search={search}
				onSearchChange={onSearchChange}
				status={statusFilter}
				onStatusChange={onStatusChange}
				languages={languages}
				selectedLanguages={selectedLanguages}
				isLanguagesLoading={isLanguagesLoading}
				onToggleLanguage={onToggleLanguage}
				onClearLanguages={onClearLanguages}
			/>

			<div className={styles.listWrapper}>
				<UserProfileCardsList
					cards={cards}
					userId={userId}
					languageByCode={languageByCode}
					isLoading={isListLoading}
					onEdit={onOpenEdit}
					onDelete={onOpenDelete}
				/>
			</div>

			{isPaginationVisible ? (
				<UserProfileCardsPagination
					total={total}
					limit={DEFAULT_LIMIT}
					offset={offset}
					onPageChange={onPageChange}
				/>
			) : null}

			<UserProfileCardModal
				open={isCreateOpen}
				mode='create'
				userId={userId}
				card={null}
				languages={languages}
				onClose={onCloseCreate}
			/>
			<UserProfileCardModal
				open={Boolean(editTarget)}
				mode='edit'
				userId={userId}
				card={editTarget}
				languages={languages}
				onClose={onCloseEdit}
			/>
			<UserProfileCardDeleteModal
				open={Boolean(deleteTarget)}
				card={deleteTarget}
				userId={userId}
				onClose={onCloseDelete}
			/>
		</Card>
	)
}

export default UserProfileCards
