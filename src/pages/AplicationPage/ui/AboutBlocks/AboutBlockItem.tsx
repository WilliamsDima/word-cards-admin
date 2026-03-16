import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import styles from "./AboutBlockItem.module.scss"
import Accordion from "@shared/Accordion/Accordion"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import type { IAplication, IBlock } from "@shared/api/services/appConfig/types"
import AboutBlockPunktRow from "./AboutBlockPunktRow"
import Badge, { BadgeVariant } from "@shared/Badge/Badge"
import { useUpdateAppConfigMutation } from "@shared/api/services/appConfig/AppConfigQuery"
import { useToast } from "@shared/Toast/useToast"
import AboutBlockDeleteModal from "./AboutBlockDeleteModal"

type Props = {
	block: IBlock
	appConfig: IAplication | undefined
	autoOpen: boolean
}

const AboutBlockItem: React.FC<Props> = memo(
	({ block, appConfig, autoOpen }) => {
		const [name, setName] = useState(block.blockName ?? "")
		const [text, setText] = useState(block.text ?? "")
		const [punkts, setPunkts] = useState<string[]>(block.punkts ?? [])
		const [isOpen, setIsOpen] = useState(false)
		const [isDeleteOpen, setIsDeleteOpen] = useState(false)

		const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation()
		const toast = useToast()

		const normalizedPunkts = useMemo(
			() => (punkts.length ? punkts : undefined),
			[punkts],
		)

		const isDirty = useMemo(() => {
			const serverName = (block.blockName ?? "").trim()
			const serverText = (block.text ?? "").trim()
			const localName = name.trim()
			const localText = text.trim()
			if (serverName !== localName) return true
			if (serverText !== localText) return true
			const serverPunkts = block.punkts ?? []
			if (serverPunkts.length !== punkts.length) return true
			return serverPunkts.some(
				(punkt, index) => (punkt ?? "").trim() !== (punkts[index] ?? "").trim(),
			)
		}, [block.blockName, block.punkts, block.text, name, punkts, text])

		const isDraft = useMemo(() => {
			const hasName = name.trim().length > 0
			const hasText = text.trim().length > 0
			const hasPunkt = punkts.some(punkt => punkt.trim().length > 0)
			return !hasName && !hasText && !hasPunkt
		}, [name, punkts, text])

		const title = useMemo(() => {
			const trimmed = name.trim()
			return trimmed.length ? trimmed : `Блок #${block.id}`
		}, [block.id, name])

		const meta = useMemo(() => {
			const textInfo = text.trim().length ? "Есть текст" : "Без текста"
			const punktCount = punkts.length
			const punktsInfo = punktCount ? `Пункты: ${punktCount}` : "Без пунктов"
			return `${textInfo} - ${punktsInfo}`
		}, [punkts.length, text])

		const badgeText = useMemo(() => {
			if (isDraft) return "Черновик"
			if (isDirty) return "Есть изменения"
			return "Синхронизировано"
		}, [isDirty, isDraft])

		const badgeVariant = useMemo<BadgeVariant>(() => {
			if (badgeText === "Черновик") return "warning"
			if (badgeText === "Есть изменения") return "success"
			return "neutral"
		}, [badgeText])

		const isSaveDisabled = useMemo(
			() => !isDirty || isSaving,
			[isDirty, isSaving],
		)

		const isResetDisabled = useMemo(
			() => !isDirty || isSaving,
			[isDirty, isSaving],
		)

		const onToggleHandler = useCallback(() => {
			setIsOpen(prev => !prev)
		}, [])

		const onAddPunktHandler = useCallback(() => {
			setPunkts(prev => [...prev, ""])
		}, [])

		const onChangeName = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setName(e.target.value),
			[],
		)

		const onChangeText = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setText(e.target.value),
			[],
		)

		const onChangePunkt = useCallback((index: number, value: string) => {
			setPunkts(prev => prev.map((punkt, i) => (i === index ? value : punkt)))
		}, [])

		const onRemovePunkt = useCallback((index: number) => {
			setPunkts(prev => prev.filter((_, i) => i !== index))
		}, [])

		const onSaveHandler = useCallback(async () => {
			if (!appConfig) return
			const nextBlocks = appConfig.about.blocks.map(item =>
				item.id === block.id
					? {
							...item,
							blockName: name,
							text,
							punkts: normalizedPunkts,
						}
					: item,
			)
			const nextConfig = {
				...appConfig,
				about: {
					...appConfig.about,
					blocks: nextBlocks,
				},
			}

			try {
				await updateConfig(nextConfig).unwrap()
				toast.success("Блок обновлён")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось обновить блок",
				)
			}
		}, [appConfig, block.id, name, normalizedPunkts, text, toast, updateConfig])

		const onResetHandler = useCallback(() => {
			setName(block.blockName ?? "")
			setText(block.text ?? "")
			setPunkts(block.punkts ?? [])
		}, [block.blockName, block.punkts, block.text])

		const onDeleteHandler = useCallback(() => {
			setIsDeleteOpen(true)
		}, [])

		const onCloseDelete = useCallback(() => {
			setIsDeleteOpen(false)
		}, [])

		const nameLabel = useMemo(() => "Название блока", [])
		const textLabel = useMemo(() => "Текст", [])
		const punktTitle = useMemo(() => "Пункты", [])
		const addPunktLabel = useMemo(() => "Добавить пункт", [])
		const punktEmptyText = useMemo(() => "Нет пунктов - добавьте первый", [])
		const saveLabel = useMemo(
			() => (isSaving ? "Сохранение..." : "Сохранить"),
			[isSaving],
		)
		const resetLabel = useMemo(() => "Отменить", [])
		const deleteLabel = useMemo(() => "Удалить", [])

		useEffect(() => {
			setName(block.blockName ?? "")
			setText(block.text ?? "")
			setPunkts(block.punkts ?? [])
		}, [block.blockName, block.punkts, block.text])

		useEffect(() => {
			if (autoOpen) {
				setIsOpen(true)
			}
		}, [autoOpen])

		return (
			<>
				<Accordion
					open={isOpen}
					onOpenChange={onToggleHandler}
					className={styles.card}
					headerClassName={styles.header}
					contentClassName={styles.body}
					header={
						<div className={styles.headerContent}>
							<div className={styles.titleBlock}>
								<p className={styles.title}>{title}</p>
								<p className={styles.meta}>{meta}</p>
							</div>
							<Badge label={badgeText} variant={badgeVariant} />
						</div>
					}
				>
					<div className={styles.fields}>
						<label className={styles.field}>
							<span className={styles.label}>{nameLabel}</span>
							<Input value={name} onChange={onChangeName} />
						</label>
						<label className={styles.field}>
							<span className={styles.label}>{textLabel}</span>
							<Input value={text} onChange={onChangeText} />
						</label>
					</div>

					<div className={styles.punktSection}>
						<div className={styles.punktHeader}>
							<p className={styles.punktTitle}>{punktTitle}</p>
							<Button
								className={styles.punktAddBtn}
								onClick={onAddPunktHandler}
							>
								{addPunktLabel}
							</Button>
						</div>
						<div className={styles.punktList}>
							{punkts.length ? (
								punkts.map((punkt, index) => (
									<AboutBlockPunktRow
										key={`${block.id}-punkt-${index}`}
										index={index}
										value={punkt}
										onChangePunkt={onChangePunkt}
										onRemovePunkt={onRemovePunkt}
									/>
								))
							) : (
								<div className={styles.punktEmpty}>{punktEmptyText}</div>
							)}
						</div>
					</div>

					<div className={styles.actions}>
						<Button
							className={styles.primaryBtn}
							onClick={onSaveHandler}
							disabled={isSaveDisabled}
						>
							{saveLabel}
						</Button>
						<Button
							className={styles.ghostBtn}
							onClick={onResetHandler}
							disabled={isResetDisabled}
						>
							{resetLabel}
						</Button>
						<Button className={styles.dangerBtn} onClick={onDeleteHandler}>
							{deleteLabel}
						</Button>
					</div>
				</Accordion>

				<AboutBlockDeleteModal
					open={isDeleteOpen}
					block={block}
					appConfig={appConfig}
					onClose={onCloseDelete}
				/>
			</>
		)
	},
)

export default AboutBlockItem
