import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import styles from "./AboutBlocks.module.scss"
import Button from "@shared/Button/Button"
import Loading from "@shared/Loading/Loading"
import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { useToast } from "@shared/Toast/useToast"
import type { IBlock } from "@shared/api/services/appConfig/types"
import AboutBlockItem from "./AboutBlockItem"
import AboutBlockDeleteModal from "./AboutBlockDeleteModal"

const AboutBlockList: React.FC = memo(() => {
	const [blocks, setBlocks] = useState<IBlock[]>([])
	const [dirtyMap, setDirtyMap] = useState<Record<number, boolean>>({})
	const [expandedId, setExpandedId] = useState<number | null>(null)
	const [savingId, setSavingId] = useState<number | null>(null)
	const [deleteId, setDeleteId] = useState<number | null>(null)

	const { data, isLoading, isError } = useGetAppConfigQuery()
	const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation()
	const toast = useToast()

	const serverBlocks = useMemo(() => data?.about?.blocks ?? [], [data])
	const serverIds = useMemo(
		() => new Set(serverBlocks.map(block => block.id)),
		[serverBlocks],
	)
	const serverMap = useMemo(
		() => new Map(serverBlocks.map(block => [block.id, block])),
		[serverBlocks],
	)

	const dirtyFlags = useMemo<Record<number, boolean>>(
		() =>
			blocks.reduce<Record<number, boolean>>(
				(acc, block) => ({ ...acc, [block.id]: Boolean(dirtyMap[block.id]) }),
				{},
			),
		[blocks, dirtyMap],
	)

	const expandedFlags = useMemo<Record<number, boolean>>(
		() =>
			blocks.reduce<Record<number, boolean>>(
				(acc, block) => ({ ...acc, [block.id]: block.id === expandedId }),
				{},
			),
		[blocks, expandedId],
	)

	const savingFlags = useMemo<Record<number, boolean>>(
		() =>
			blocks.reduce<Record<number, boolean>>(
				(acc, block) => ({
					...acc,
					[block.id]: isSaving && savingId === block.id,
				}),
				{},
			),
		[blocks, isSaving, savingId],
	)

	const isEmpty = useMemo(
		() => !isLoading && !isError && blocks.length === 0,
		[blocks.length, isError, isLoading],
	)

	const onToggle = useCallback((id: number) => {
		setExpandedId(prev => (prev === id ? null : id))
	}, [])

	const markDirty = useCallback((id: number) => {
		setDirtyMap(prev => ({ ...prev, [id]: true }))
	}, [])

	const onChangeField = useCallback(
		(id: number, field: "blockName" | "text", value: string) => {
			setBlocks(prev =>
				prev.map(block =>
					block.id === id
						? {
								...block,
								[field]: value,
							}
						: block,
				),
			)
			markDirty(id)
		},
		[markDirty],
	)

	const onChangePunkt = useCallback(
		(id: number, index: number, value: string) => {
			setBlocks(prev =>
				prev.map(block => {
					if (block.id !== id) return block
					const nextPunkts = block.punkts ? [...block.punkts] : []
					nextPunkts[index] = value
					return {
						...block,
						punkts: nextPunkts,
					}
				}),
			)
			markDirty(id)
		},
		[markDirty],
	)

	const onAddPunkt = useCallback(
		(id: number) => {
			setBlocks(prev =>
				prev.map(block => {
					if (block.id !== id) return block
					const nextPunkts = block.punkts ? [...block.punkts] : []
					return {
						...block,
						punkts: [...nextPunkts, ""],
					}
				}),
			)
			markDirty(id)
		},
		[markDirty],
	)

	const onRemovePunkt = useCallback(
		(id: number, index: number) => {
			setBlocks(prev =>
				prev.map(block => {
					if (block.id !== id) return block
					const nextPunkts = block.punkts ? [...block.punkts] : []
					const filtered = nextPunkts.filter((_, i) => i !== index)
					return {
						...block,
						punkts: filtered.length ? filtered : undefined,
					}
				}),
			)
			markDirty(id)
		},
		[markDirty],
	)

	const onAddBlock = useCallback(() => {
		setBlocks(prev => {
			const maxId = prev.length ? Math.max(...prev.map(block => block.id)) : 0
			const nextId = maxId + 1
			setDirtyMap(prevDirty => ({ ...prevDirty, [nextId]: true }))
			setExpandedId(nextId)
			return [
				...prev,
				{
					id: nextId,
					blockName: "",
					text: "",
					punkts: [],
				},
			]
		})
	}, [])

	const onSaveBlock = useCallback(
		async (id: number) => {
			if (!data) return
			setSavingId(id)
			const nextConfig = {
				...data,
				about: {
					...data.about,
					blocks,
				},
			}

			try {
				await updateConfig(nextConfig).unwrap()
				setDirtyMap(prev => ({ ...prev, [id]: false }))
				toast.success("Блок обновлён")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось обновить блок",
				)
			} finally {
				setSavingId(null)
			}
		},
		[blocks, data, toast, updateConfig],
	)

	const onResetBlock = useCallback(
		(id: number) => {
			const serverBlock = serverMap.get(id)
			if (!serverBlock) {
				setBlocks(prev => prev.filter(block => block.id !== id))
				setDirtyMap(prev => ({ ...prev, [id]: false }))
				return
			}

			setBlocks(prev =>
				prev.map(block => (block.id === id ? serverBlock : block)),
			)
			setDirtyMap(prev => ({ ...prev, [id]: false }))
		},
		[serverMap],
	)

	const onRequestDelete = useCallback((id: number) => {
		setDeleteId(id)
	}, [])

	useEffect(() => {
		if (!data) return
		setBlocks(prev => {
			if (!prev.length) return serverBlocks
			const dataIds = new Set(serverBlocks.map(block => block.id))
			const merged = serverBlocks.map(block => {
				const isDirty = dirtyMap[block.id]
				if (!isDirty) return block
				const local = prev.find(item => item.id === block.id)
				return local ?? block
			})
			const localOnly = prev.filter(block => !dataIds.has(block.id))
			return [...merged, ...localOnly]
		})
	}, [data, dirtyMap, serverBlocks])

	return (
		<>
			<div className={styles.header}>
				<div>
					<h2 className={styles.title}>Блоки “О приложении”</h2>
					<p className={styles.subtitle}>
						Добавляйте и редактируйте секции для экрана описания приложения.
					</p>
				</div>
				<Button className={styles.addBtn} onClick={onAddBlock}>
					Добавить блок
				</Button>
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<Loading className={styles.spinner} />
					<span>Загружаем блоки...</span>
				</div>
			) : null}

			{isError && !isLoading ? (
				<div className={styles.empty}>
					<span className={styles.emptyTitle}>Не удалось загрузить блоки</span>
					<span className={styles.emptyText}>
						Проверьте подключение и повторите попытку позже.
					</span>
				</div>
			) : null}

			{!isLoading && !isError ? (
				isEmpty ? (
					<div className={styles.empty}>
						<span className={styles.emptyTitle}>Нет блоков</span>
						<span className={styles.emptyText}>
							Создайте первый блок, чтобы наполнить описание приложения.
						</span>
					</div>
				) : (
					<div className={styles.list}>
						{blocks.map(block => (
							<AboutBlockItem
								key={block.id}
								block={block}
								isDirty={dirtyFlags[block.id]}
								isExpanded={expandedFlags[block.id]}
								isSaving={savingFlags[block.id]}
								isNew={!serverIds.has(block.id)}
								onToggle={onToggle}
								onChangeField={onChangeField}
								onChangePunkt={onChangePunkt}
								onAddPunkt={onAddPunkt}
								onRemovePunkt={onRemovePunkt}
								onSave={onSaveBlock}
								onReset={onResetBlock}
								onDelete={onRequestDelete}
							/>
						))}
					</div>
				)
			) : null}

			<AboutBlockDeleteModal
				open={Boolean(deleteId)}
				deleteId={deleteId}
				blocks={blocks}
				serverIds={serverIds}
				data={data}
				savingId={savingId}
				setBlocks={setBlocks}
				setDirtyMap={setDirtyMap}
				setExpandedId={setExpandedId}
				setDeleteId={setDeleteId}
				setSavingId={setSavingId}
			/>
		</>
	)
})

export default AboutBlockList
