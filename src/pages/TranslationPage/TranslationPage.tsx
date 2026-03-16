import React, { useCallback, useEffect, useMemo, useState } from "react"
import Button from "@shared/Button/Button"
import styles from "./TranslationPage.module.scss"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"
import { useGetLanguagesQuery } from "@shared/api/services/languages/LanguagesQuery"
import Loading from "@shared/Loading/Loading"
import Badge from "@shared/Badge/Badge"
import LanguageListItem from "./ui/LanguageListItem"
import DeleteLanguageModal from "./ui/DeleteLanguageModal"
import CreateLanguageModal from "./ui/CreateLanguageModal"
import type {
	JsonValue,
	LanguageItem,
} from "@shared/api/services/languages/types"

const buildFallbackJson = (language: LanguageItem) => ({
	meta: {
		code: language.code,
		name: language.name,
	},
	common: {
		ok: "OK",
		cancel: "Cancel",
	},
})

export type DirtyMap = Record<string, boolean>

export type DraftMap = Record<string, JsonValue>

function TranslationPage() {
	const { data, isLoading, isError } = useGetLanguagesQuery()

	const [expandedCode, setExpandedCode] = useState<string | null>(null)
	const [drafts, setDrafts] = useState<DraftMap>({})
	const [dirtyMap, setDirtyMap] = useState<DirtyMap>({})
	const [deleteTarget, setDeleteTarget] = useState<LanguageItem | null>(null)
	const [isCreateOpen, setIsCreateOpen] = useState(false)

	const languages = useMemo(() => {
		return data
			? Object.values(data).sort((a, b) => a.name.localeCompare(b.name))
			: []
	}, [data])

	const languagesCount = useMemo(() => languages.length, [languages])

	const getDraft = useCallback(
		(language: LanguageItem) => {
			return (
				drafts[language.code] ?? language.json ?? buildFallbackJson(language)
			)
		},
		[drafts],
	)

	const toggleCard = useCallback((code: string) => {
		setExpandedCode(prev => (prev === code ? null : code))
	}, [])

	const onChangeJson = useCallback((code: string, value: unknown) => {
		setDrafts(prev => ({
			...prev,
			[code]: (value as JsonValue) ?? {},
		}))
		setDirtyMap(prev => ({ ...prev, [code]: true }))
	}, [])

	const onReset = useCallback((language: LanguageItem) => {
		setDrafts(prev => ({
			...prev,
			[language.code]: language.json ?? buildFallbackJson(language),
		}))
		setDirtyMap(prev => ({ ...prev, [language.code]: false }))
	}, [])

	const onOpenCreate = () => setIsCreateOpen(true)

	useEffect(() => {
		if (!languages.length) return
		setDrafts(prev => {
			const next = { ...prev }
			languages.forEach(language => {
				if (!next[language.code]) {
					next[language.code] = language.json ?? buildFallbackJson(language)
				}
			})
			return next
		})
	}, [languages])

	return (
		<div className={styles.page}>
			<PageHeader
				title='Переводы'
				subtitle='Локализованных приложения и добавление языков.'
			/>

			<Card className={styles.card}>
				<div className={styles.listHeader}>
					<div>
						<div className={styles.sectionTitleRow}>
							<h2 className={styles.sectionTitle}>Список языков</h2>
							<Badge label={`Всего: ${languagesCount}`} variant='info' />
						</div>
						<p className={styles.sectionHint}>
							Раскройте карточку, отредактируйте JSON и сохраните правки.
						</p>
					</div>
					<Button className={styles.addBtn} onClick={onOpenCreate}>
						Добавить язык
					</Button>
				</div>

				{isLoading && (
					<div className={styles.loadingState}>
						<Loading className={styles.loadingSpinner} />
						<span>Загружаем языки...</span>
					</div>
				)}

				{isError && !isLoading && (
					<div className={styles.empty}>
						<span className={styles.emptyTitle}>
							Не удалось загрузить языки
						</span>
						<span className={styles.emptyText}>
							Проверьте подключение и повторите позже.
						</span>
					</div>
				)}

				{!isLoading && !isError && (
					<div className={styles.listWrapper}>
						<div className={styles.list}>
							{languages.length === 0 ? (
								<div className={styles.empty}>
									<span className={styles.emptyTitle}>Нет языков</span>
									<span className={styles.emptyText}>
										Добавьте первый язык, чтобы начать работу.
									</span>
								</div>
							) : (
								languages.map(language => {
									const isExpanded = expandedCode === language.code
									const isDirty = Boolean(dirtyMap[language.code])

									return (
										<LanguageListItem
											key={language.code}
											drafts={drafts}
											language={language}
											isExpanded={isExpanded}
											isDirty={isDirty}
											setDirtyMap={setDirtyMap}
											draft={getDraft(language)}
											onToggle={toggleCard}
											onChangeJson={onChangeJson}
											onReset={onReset}
											setDeleteTarget={setDeleteTarget}
										/>
									)
								})
							)}
						</div>
					</div>
				)}
			</Card>

			<DeleteLanguageModal
				setDirtyMap={setDirtyMap}
				setDeleteTarget={setDeleteTarget}
				deleteTarget={deleteTarget}
			/>

			<CreateLanguageModal
				open={isCreateOpen}
				setIsCreateOpen={setIsCreateOpen}
			/>
		</div>
	)
}

export default TranslationPage
