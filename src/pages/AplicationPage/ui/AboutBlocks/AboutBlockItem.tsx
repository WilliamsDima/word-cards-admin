import React, { memo, useCallback, useMemo } from "react"
import styles from "./AboutBlockItem.module.scss"
import Accordion from "@shared/Accordion/Accordion"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import type { IBlock } from "@shared/api/services/appConfig/types"
import AboutBlockPunktRow from "./AboutBlockPunktRow"
import Badge, { BadgeVariant } from "@shared/Badge/Badge"

type Props = {
	block: IBlock
	isDirty: boolean
	isExpanded: boolean
	isSaving: boolean
	isNew: boolean
	onToggle: (id: number) => void
	onChangeField: (id: number, field: "blockName" | "text", value: string) => void
	onChangePunkt: (id: number, index: number, value: string) => void
	onAddPunkt: (id: number) => void
	onRemovePunkt: (id: number, index: number) => void
	onSave: (id: number) => void
	onReset: (id: number) => void
	onDelete: (id: number) => void
}

const AboutBlockItem: React.FC<Props> = memo(
	({
		block,
		isDirty,
		isExpanded,
		isSaving,
		isNew,
		onToggle,
		onChangeField,
		onChangePunkt,
		onAddPunkt,
		onRemovePunkt,
		onSave,
		onReset,
		onDelete,
	}) => {
		const title = useMemo(() => {
			const name = block.blockName?.trim()
			return name?.length ? name : `Блок #${block.id}`
		}, [block.blockName, block.id])

		const meta = useMemo(() => {
			const textInfo = block.text?.trim().length ? "Есть текст" : "Без текста"
			const punktCount = block.punkts?.length ?? 0
			const punktsInfo = punktCount ? `Пункты: ${punktCount}` : "Без пунктов"
			return `${textInfo} • ${punktsInfo}`
		}, [block.punkts, block.text])

		const badgeText = useMemo(() => {
			if (isNew) return "Новый"
			if (isDirty) return "Черновик"
			return "Синхронизировано"
		}, [isDirty, isNew])

		const badgeVariant = useMemo<BadgeVariant>(() => {
			if (badgeText === "Черновик") return "warning"
			if (badgeText === "Новый") return "success"
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

		const onToggleHandler = useCallback(() => onToggle(block.id), [block.id, onToggle])
		const onSaveHandler = useCallback(() => onSave(block.id), [block.id, onSave])
		const onResetHandler = useCallback(() => onReset(block.id), [block.id, onReset])
		const onDeleteHandler = useCallback(() => onDelete(block.id), [block.id, onDelete])
		const onAddPunktHandler = useCallback(
			() => onAddPunkt(block.id),
			[block.id, onAddPunkt],
		)

		const onChangeName = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeField(block.id, "blockName", e.target.value),
			[block.id, onChangeField],
		)

		const onChangeText = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeField(block.id, "text", e.target.value),
			[block.id, onChangeField],
		)

		const punktRows = useMemo(
			() =>
				(block.punkts ?? []).map((punkt, index) => (
					<AboutBlockPunktRow
						key={`${block.id}-punkt-${index}`}
						blockId={block.id}
						index={index}
						value={punkt}
						onChangePunkt={onChangePunkt}
						onRemovePunkt={onRemovePunkt}
					/>
				)),
			[block.id, block.punkts, onChangePunkt, onRemovePunkt],
		)

		const header = useCallback(
			() => (
				<div className={styles.headerContent}>
					<div className={styles.titleBlock}>
						<p className={styles.title}>{title}</p>
						<p className={styles.meta}>{meta}</p>
					</div>
					<Badge label={badgeText} variant={badgeVariant} />
				</div>
			),
			[badgeText, badgeVariant, meta, title],
		)

		return (
			<Accordion
				open={isExpanded}
				onOpenChange={onToggleHandler}
				className={styles.card}
				headerClassName={styles.header}
				contentClassName={styles.body}
				header={header}
			>
				<div className={styles.fields}>
					<label className={styles.field}>
						<span className={styles.label}>Название блока</span>
						<Input value={block.blockName ?? ""} onChange={onChangeName} />
					</label>
					<label className={styles.field}>
						<span className={styles.label}>Текст</span>
						<Input value={block.text ?? ""} onChange={onChangeText} />
					</label>
				</div>

				<div className={styles.punktSection}>
					<div className={styles.punktHeader}>
						<p className={styles.punktTitle}>Пункты</p>
						<Button className={styles.punktAddBtn} onClick={onAddPunktHandler}>
							Добавить пункт
						</Button>
					</div>
					<div className={styles.punktList}>
						{punktRows.length ? (
							punktRows
						) : (
							<div className={styles.punktEmpty}>
								Нет пунктов — добавьте первый
							</div>
						)}
					</div>
				</div>

				<div className={styles.actions}>
					<Button
						className={styles.primaryBtn}
						onClick={onSaveHandler}
						disabled={isSaveDisabled}
					>
						{isSaving ? "Сохранение..." : "Сохранить"}
					</Button>
					<Button
						className={styles.ghostBtn}
						onClick={onResetHandler}
						disabled={isResetDisabled}
					>
						Отменить
					</Button>
					<Button className={styles.dangerBtn} onClick={onDeleteHandler}>
						Удалить
					</Button>
				</div>
			</Accordion>
		)
	},
)

export default AboutBlockItem
