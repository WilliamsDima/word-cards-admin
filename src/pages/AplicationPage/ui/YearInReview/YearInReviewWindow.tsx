import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import styles from "./YearInReview.module.scss"
import Input from "@shared/Input/Input"
import Button from "@shared/Button/Button"
import Badge, { BadgeVariant } from "@shared/Badge/Badge"
import Loading from "@shared/Loading/Loading"
import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { useToast } from "@shared/Toast/useToast"
import type { IYearInReviewWindow } from "@shared/api/services/appConfig/types"

type FormState = {
	start_month: string
	start_day: string
	end_month: string
	end_day: string
	end_hour: string
	end_minute: string
}

type FormField = keyof FormState

const emptyForm: FormState = {
	start_month: "",
	start_day: "",
	end_month: "",
	end_day: "",
	end_hour: "",
	end_minute: "",
}

const buildFormFromWindow = (windowRule: IYearInReviewWindow): FormState => ({
	start_month: String(windowRule.start_month),
	start_day: String(windowRule.start_day),
	end_month: String(windowRule.end_month),
	end_day: String(windowRule.end_day),
	end_hour: String(windowRule.end_hour),
	end_minute: String(windowRule.end_minute),
})

const YearInReviewWindow: React.FC = memo(() => {
	const [form, setForm] = useState<FormState>(emptyForm)

	const { data, isLoading, isError } = useGetAppConfigQuery()
	const [updateConfig, { isLoading: isSaving }] = useUpdateAppConfigMutation()
	const toast = useToast()

	const serverWindow = useMemo(() => data?.year_in_review.window, [data])

	const parsedValues = useMemo<IYearInReviewWindow>(
		() => ({
			start_month: Number(form.start_month),
			start_day: Number(form.start_day),
			end_month: Number(form.end_month),
			end_day: Number(form.end_day),
			end_hour: Number(form.end_hour),
			end_minute: Number(form.end_minute),
		}),
		[form],
	)

	const isInvalid = useMemo(
		() => Object.values(parsedValues).some(value => !Number.isFinite(value)),
		[parsedValues],
	)

	const isDirty = useMemo(() => {
		if (!serverWindow) return false
		return (
			serverWindow.start_month !== parsedValues.start_month ||
			serverWindow.start_day !== parsedValues.start_day ||
			serverWindow.end_month !== parsedValues.end_month ||
			serverWindow.end_day !== parsedValues.end_day ||
			serverWindow.end_hour !== parsedValues.end_hour ||
			serverWindow.end_minute !== parsedValues.end_minute
		)
	}, [parsedValues, serverWindow])

	const isSaveDisabled = useMemo(
		() => !isDirty || isInvalid || isSaving,
		[isDirty, isInvalid, isSaving],
	)

	const isResetDisabled = useMemo(
		() => !isDirty || isSaving,
		[isDirty, isSaving],
	)

	const onChangeField = useCallback((field: FormField, value: string) => {
		setForm(prev => ({ ...prev, [field]: value }))
	}, [])

	const onChangeStartMonth = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("start_month", e.target.value),
		[onChangeField],
	)
	const onChangeStartDay = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("start_day", e.target.value),
		[onChangeField],
	)
	const onChangeEndMonth = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("end_month", e.target.value),
		[onChangeField],
	)
	const onChangeEndDay = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("end_day", e.target.value),
		[onChangeField],
	)
	const onChangeEndHour = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("end_hour", e.target.value),
		[onChangeField],
	)
	const onChangeEndMinute = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("end_minute", e.target.value),
		[onChangeField],
	)

	const onSaveHandler = useCallback(async () => {
		if (!data || isInvalid) return
		const nextConfig = {
			...data,
			year_in_review: {
				...data.year_in_review,
				window: parsedValues,
			},
		}

		try {
			await updateConfig(nextConfig).unwrap()
			toast.success("Окно показа обновлено")
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data
					?.error ?? null
			toast.error("Ошибка сохранения", serverError || "Не удалось сохранить")
		}
	}, [data, isInvalid, parsedValues, toast, updateConfig])

	const onResetHandler = useCallback(() => {
		if (!serverWindow) return
		setForm(buildFormFromWindow(serverWindow))
	}, [serverWindow])

	const badgeText = useMemo(() => {
		if (isInvalid) return "Некорректные значения"
		if (isDirty) return "Есть изменения"
		return "Синхронизировано"
	}, [isDirty, isInvalid])

	const badgeVariant = useMemo<BadgeVariant>(() => {
		if (badgeText === "Некорректные значения") return "warning"
		if (badgeText === "Есть изменения") return "success"
		return "neutral"
	}, [badgeText])

	const saveLabel = useMemo(
		() => (isSaving ? "Сохранение..." : "Сохранить"),
		[isSaving],
	)

	useEffect(() => {
		if (!serverWindow) return
		setForm(buildFormFromWindow(serverWindow))
	}, [serverWindow])

	return (
		<div className={styles.windowBlock}>
			<div className={styles.windowHeader}>
				<div>
					<h3 className={styles.blockTitle}>Окно показа</h3>
					<p className={styles.blockSubtitle}>
						Повторяющееся правило месяц/день — работает автоматически каждый
						год без ручного добавления даты.
					</p>
				</div>
				{!isLoading && !isError ? (
					<Badge label={badgeText} variant={badgeVariant} />
				) : (
					<></>
				)}
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<Loading className={styles.spinner} />
					<span>Загружаем окно показа...</span>
				</div>
			) : (
				<></>
			)}

			{isError && !isLoading ? (
				<div className={styles.empty}>
					<span className={styles.emptyTitle}>
						Не удалось загрузить настройки
					</span>
					<span className={styles.emptyText}>
						Проверьте подключение и повторите попытку позже.
					</span>
				</div>
			) : (
				<></>
			)}

			{!isLoading && !isError ? (
				<>
					<div className={styles.windowFields}>
						<label className={styles.field}>
							<span className={styles.label}>Начало: месяц</span>
							<Input
								inputMode='numeric'
								value={form.start_month}
								onChange={onChangeStartMonth}
							/>
						</label>
						<label className={styles.field}>
							<span className={styles.label}>Начало: день</span>
							<Input
								inputMode='numeric'
								value={form.start_day}
								onChange={onChangeStartDay}
							/>
						</label>
						<label className={styles.field}>
							<span className={styles.label}>Конец: месяц</span>
							<Input
								inputMode='numeric'
								value={form.end_month}
								onChange={onChangeEndMonth}
							/>
						</label>
						<label className={styles.field}>
							<span className={styles.label}>Конец: день</span>
							<Input
								inputMode='numeric'
								value={form.end_day}
								onChange={onChangeEndDay}
							/>
						</label>
						<label className={styles.field}>
							<span className={styles.label}>Конец: час</span>
							<Input
								inputMode='numeric'
								value={form.end_hour}
								onChange={onChangeEndHour}
							/>
						</label>
						<label className={styles.field}>
							<span className={styles.label}>Конец: минута</span>
							<Input
								inputMode='numeric'
								value={form.end_minute}
								onChange={onChangeEndMinute}
							/>
						</label>
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
							Отменить
						</Button>
					</div>
				</>
			) : (
				<></>
			)}
		</div>
	)
})

export default YearInReviewWindow
