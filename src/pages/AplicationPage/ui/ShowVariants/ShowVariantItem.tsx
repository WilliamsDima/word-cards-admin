import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import styles from "./ShowVariantItem.module.scss"
import Accordion from "@shared/Accordion/Accordion"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import Badge, { BadgeVariant } from "@shared/Badge/Badge"
import { useUpdateAppConfigMutation } from "@shared/api/services/appConfig/AppConfigQuery"
import { useToast } from "@shared/Toast/useToast"
import type {
	IAplication,
	ShowVariantsOption,
} from "@shared/api/services/appConfig/types"
import ShowVariantDeleteModal from "./ShowVariantDeleteModal"

type Props = {
	variant: ShowVariantsOption
	appConfig: IAplication | undefined
	autoOpen: boolean
}

const ShowVariantItem: React.FC<Props> = memo(
	({ variant, appConfig, autoOpen }) => {
		const [localValue, setLocalValue] = useState(variant.value)
		const [localLabel, setLocalLabel] = useState(variant.label ?? "")
		const [isOpen, setIsOpen] = useState(false)
		const [isDeleteOpen, setIsDeleteOpen] = useState(false)

		const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation()
		const toast = useToast()

		const isValueInvalid = useMemo(
			() => localValue.trim().length === 0,
			[localValue],
		)

		const isLabelInvalid = useMemo(
			() => localLabel.trim().length === 0,
			[localLabel],
		)

		const isInvalid = useMemo(
			() => isValueInvalid || isLabelInvalid,
			[isLabelInvalid, isValueInvalid],
		)

		const isDirty = useMemo(() => {
			return variant.value !== localValue || variant.label !== localLabel
		}, [localLabel, localValue, variant.label, variant.value])

		const title = useMemo(() => {
			const labelTrimmed = localLabel.trim()
			if (labelTrimmed.length) return labelTrimmed
			const valueTrimmed = localValue.trim()
			if (valueTrimmed.length) return valueTrimmed
			return "Вариант"
		}, [localLabel, localValue])

		const meta = useMemo(() => {
			const valueInfo = localValue.trim().length
				? `Код: ${localValue}`
				: "Без кода"
			const labelInfo = localLabel.trim().length
				? "Есть подпись"
				: "Без подписи"
			return `${valueInfo} • ${labelInfo}`
		}, [localLabel, localValue])

		const badgeText = useMemo(() => {
			if (isInvalid) return "Нужны данные"
			if (isDirty) return "Есть изменения"
			return "Синхронизировано"
		}, [isDirty, isInvalid])

		const badgeVariant = useMemo<BadgeVariant>(() => {
			if (badgeText === "Нужны данные") return "warning"
			if (badgeText === "Есть изменения") return "success"
			return "neutral"
		}, [badgeText])

		const isSaveDisabled = useMemo(
			() => !isDirty || isSaving || isInvalid,
			[isDirty, isInvalid, isSaving],
		)

		const isResetDisabled = useMemo(
			() => !isDirty || isSaving,
			[isDirty, isSaving],
		)

		const onToggleHandler = useCallback(() => {
			setIsOpen(prev => !prev)
		}, [])

		const onChangeValue = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setLocalValue(e.target.value),
			[],
		)

		const onChangeLabel = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setLocalLabel(e.target.value),
			[],
		)

		const onSaveHandler = useCallback(async () => {
			if (!appConfig) return
			const nextVariants = appConfig.showVariantsList.map(item =>
				item.value === variant.value
					? {
							value: localValue,
							label: localLabel,
						}
					: item,
			)
			const nextConfig = {
				...appConfig,
				showVariantsList: nextVariants,
			}

			try {
				await updateConfig(nextConfig).unwrap()
				toast.success("Вариант обновлён")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось обновить вариант",
				)
			}
		}, [appConfig, localLabel, localValue, toast, updateConfig, variant.value])

		const onResetHandler = useCallback(() => {
			setLocalValue(variant.value)
			setLocalLabel(variant.label ?? "")
		}, [variant.label, variant.value])

		const onDeleteHandler = useCallback(() => {
			setIsDeleteOpen(true)
		}, [])

		const onCloseDelete = useCallback(() => {
			setIsDeleteOpen(false)
		}, [])

		const valueLabel = useMemo(() => "Код варианта", [])
		const labelLabel = useMemo(() => "Подпись (ключ для перевода)", [])
		const saveLabel = useMemo(
			() => (isSaving ? "Сохранение..." : "Сохранить"),
			[isSaving],
		)
		const resetLabel = useMemo(() => "Отменить", [])
		const deleteLabel = useMemo(() => "Удалить", [])
		const valueWarningText = useMemo(() => "Укажите код варианта.", [])
		const labelWarningText = useMemo(
			() => "Укажите подпись для отображения в приложении.",
			[],
		)

		useEffect(() => {
			setLocalValue(variant.value)
			setLocalLabel(variant.label ?? "")
		}, [variant.label, variant.value])

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
							<span className={styles.label}>{valueLabel}</span>
							<Input value={localValue} onChange={onChangeValue} />
						</label>
						<label className={styles.field}>
							<span className={styles.label}>{labelLabel}</span>
							<Input value={localLabel} onChange={onChangeLabel} />
						</label>
					</div>

					{isValueInvalid ? (
						<span className={styles.warning}>{valueWarningText}</span>
					) : null}
					{isLabelInvalid ? (
						<span className={styles.warning}>{labelWarningText}</span>
					) : null}

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

				<ShowVariantDeleteModal
					open={isDeleteOpen}
					variant={variant}
					appConfig={appConfig}
					onClose={onCloseDelete}
				/>
			</>
		)
	},
)

export default ShowVariantItem
