import React, {
	memo,
	useCallback,
	useEffect,
	useMemo,
	useRef,
	useState,
} from "react"
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

const AboutBlockList: React.FC = memo(() => {
	const [autoOpenId, setAutoOpenId] = useState<number | null>(null)
	const listRef = useRef<HTMLDivElement | null>(null)

	const { data, isLoading, isError } = useGetAppConfigQuery()
	const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation()
	const toast = useToast()

	const serverBlocks = useMemo<IBlock[]>(
		() => data?.about?.blocks ?? [],
		[data],
	)

	const isEmpty = useMemo(
		() => !isLoading && !isError && serverBlocks.length === 0,
		[isError, isLoading, serverBlocks.length],
	)

	const addLabel = useMemo(
		() => (isSaving ? "Создание..." : "Добавить блок"),
		[isSaving],
	)

	const titleLabel = useMemo(() => 'Блоки "О приложении"', [])
	const subtitleLabel = useMemo(
		() => "Добавляйте и редактируйте секции для экрана описания приложения.",
		[],
	)
	const loadingLabel = useMemo(() => "Загружаем блоки...", [])
	const emptyTitle = useMemo(() => "Нет блоков", [])
	const emptyText = useMemo(
		() => "Создайте первый блок, чтобы наполнить описание приложения.",
		[],
	)
	const errorTitle = useMemo(() => "Не удалось загрузить блоки", [])
	const errorText = useMemo(
		() => "Проверьте подключение и повторите попытку позже.",
		[],
	)

	const onAddBlock = useCallback(async () => {
		if (!data) return
		const ids = serverBlocks.map(block => block.id)
		const nextId = ids.length ? Math.max(...ids) + 1 : 1
		const nextBlocks: IBlock[] = [
			...serverBlocks,
			{
				id: nextId,
				blockName: "",
				text: "",
				punkts: [],
			},
		]
		const nextConfig = {
			...data,
			about: {
				...data.about,
				blocks: nextBlocks,
			},
		}

		try {
			const updatedConfig = await updateConfig(nextConfig).unwrap()
			const prevIds = new Set(serverBlocks.map(block => block.id))
			const createdBlock = updatedConfig.about.blocks.find(
				block => !prevIds.has(block.id),
			)
			setAutoOpenId(createdBlock?.id ?? null)
			toast.success("Блок создан")
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null
			toast.error("Ошибка создания", serverError || "Не удалось создать блок")
		}
	}, [data, serverBlocks, toast, updateConfig])

	const renderBlockItems = useCallback(
		() =>
			serverBlocks.map(block => (
				<AboutBlockItem
					key={block.id}
					block={block}
					appConfig={data}
					autoOpen={block.id === autoOpenId}
				/>
			)),
		[autoOpenId, data, serverBlocks],
	)

	useEffect(() => {
		if (autoOpenId === null) return
		const exists = serverBlocks.some(block => block.id === autoOpenId)
		if (exists) {
			setAutoOpenId(null)
		}
	}, [autoOpenId, serverBlocks])

	useEffect(() => {
		if (autoOpenId === null) return
		const listNode = listRef.current
		const lastChild = listNode?.lastElementChild as HTMLElement | null
		if (!lastChild) return
		const frame = requestAnimationFrame(() => {
			lastChild.scrollIntoView({ behavior: "smooth", block: "end" })
		})
		return () => cancelAnimationFrame(frame)
	}, [autoOpenId, serverBlocks.length])

	return (
		<>
			<div className={styles.header}>
				<div>
					<h2 className={styles.title}>{titleLabel}</h2>
					<p className={styles.subtitle}>{subtitleLabel}</p>
				</div>
				<Button
					className={styles.addBtn}
					onClick={onAddBlock}
					disabled={isSaving}
				>
					{addLabel}
				</Button>
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<Loading className={styles.spinner} />
					<span>{loadingLabel}</span>
				</div>
			) : null}

			{isError && !isLoading ? (
				<div className={styles.empty}>
					<span className={styles.emptyTitle}>{errorTitle}</span>
					<span className={styles.emptyText}>{errorText}</span>
				</div>
			) : null}

			{!isLoading && !isError ? (
				isEmpty ? (
					<div className={styles.empty}>
						<span className={styles.emptyTitle}>{emptyTitle}</span>
						<span className={styles.emptyText}>{emptyText}</span>
					</div>
				) : (
					<div className={styles.list} ref={listRef}>
						{renderBlockItems()}
					</div>
				)
			) : null}
		</>
	)
})

export default AboutBlockList
