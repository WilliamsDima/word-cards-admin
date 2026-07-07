import React, {
	useActionState,
	useCallback,
	useEffect,
	useMemo,
	useState,
} from "react"
import Modal from "@shared/Modal/Modal"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import Checkbox from "@shared/Checkbox/Checkbox"
import Dropdown from "@shared/Dropdown/Dropdown"
import styles from "../AchievementsPage.module.scss"
import { useToast } from "@shared/Toast/useToast"
import {
	useCreateAchievementMutation,
	useUpdateAchievementMutation,
} from "@shared/api/services/achievements/AchievementsQuery"
import {
	ACHIEVEMENT_METRICS,
	achievementMetricLabels,
	type Achievement,
	type AchievementMetric,
	type AchievementPayload,
} from "@shared/api/services/achievements/types"

type MetricOption = {
	label: string
	value: AchievementMetric
}

const metricOptions: MetricOption[] = ACHIEVEMENT_METRICS.map(metric => ({
	label: achievementMetricLabels[metric],
	value: metric,
}))

type FormState = {
	code: string
	title: string
	description: string
	icon: string
	color_from: string
	color_to: string
	metric: AchievementMetric
	threshold: string
	sort_order: string
	is_active: boolean
}

const emptyForm: FormState = {
	code: "",
	title: "",
	description: "",
	icon: "",
	color_from: "",
	color_to: "",
	metric: ACHIEVEMENT_METRICS[0],
	threshold: "",
	sort_order: "",
	is_active: true,
}

const buildFormFromAchievement = (achievement: Achievement): FormState => ({
	code: achievement.code,
	title: achievement.title,
	description: achievement.description ?? "",
	icon: achievement.icon ?? "",
	color_from: achievement.color_from ?? "",
	color_to: achievement.color_to ?? "",
	metric: achievement.metric,
	threshold: String(achievement.threshold),
	sort_order: String(achievement.sort_order),
	is_active: achievement.is_active,
})

type Props = {
	open: boolean
	achievement: Achievement | null
	onClose: () => void
}

const AchievementModal: React.FC<Props> = ({ open, achievement, onClose }) => {
	const [form, setForm] = useState<FormState>(emptyForm)

	const [createAchievement] = useCreateAchievementMutation()
	const [updateAchievement] = useUpdateAchievementMutation()
	const toast = useToast()

	const mode = useMemo(() => (achievement ? "edit" : "create"), [achievement])

	const title = useMemo(
		() =>
			mode === "create" ? "Добавить достижение" : "Редактировать достижение",
		[mode],
	)

	const selectedMetric = useMemo(
		() => metricOptions.find(option => option.value === form.metric),
		[form.metric],
	)

	const canSubmit = useMemo(() => {
		const thresholdValue = Number(form.threshold)
		return (
			form.code.trim().length > 0 &&
			form.title.trim().length > 0 &&
			form.threshold.trim().length > 0 &&
			Number.isFinite(thresholdValue)
		)
	}, [form.code, form.threshold, form.title])

	const [formError, submitAction, isPending] = useActionState(
		async () => {
			const code = form.code.trim()
			const titleValue = form.title.trim()
			const threshold = Number(form.threshold)
			const sortOrder = form.sort_order.trim()
				? Number(form.sort_order)
				: undefined

			if (!code || !titleValue || !Number.isFinite(threshold)) {
				return "Заполните обязательные поля"
			}

			const payload: AchievementPayload = {
				code,
				title: titleValue,
				description: form.description.trim() || undefined,
				icon: form.icon.trim() || undefined,
				color_from: form.color_from.trim() || undefined,
				color_to: form.color_to.trim() || undefined,
				metric: form.metric,
				threshold,
				sort_order: sortOrder,
				is_active: form.is_active,
			}

			try {
				if (mode === "create") {
					await createAchievement(payload).unwrap()
					toast.success("Достижение создано", titleValue)
				} else if (achievement) {
					await updateAchievement({ id: achievement.id, payload }).unwrap()
					toast.success("Достижение обновлено", titleValue)
				}
				onClose()
				return null
			} catch (err) {
				const status =
					typeof (err as { status?: number })?.status === "number"
						? (err as { status?: number }).status
						: undefined
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null

				if (status === 409) {
					toast.error(
						"Ошибка сохранения",
						"Достижение с таким кодом уже существует",
					)
					return "Достижение с таким кодом уже существует"
				}

				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось сохранить достижение",
				)
				return serverError || "Не удалось сохранить достижение"
			}
		},
		null,
	)

	const onCloseModal = useCallback(() => onClose(), [onClose])

	const onChangeField = useCallback(
		(field: keyof Omit<FormState, "metric" | "is_active">, value: string) => {
			setForm(prev => ({ ...prev, [field]: value }))
		},
		[],
	)

	const onChangeCode = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("code", e.target.value),
		[onChangeField],
	)
	const onChangeTitle = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("title", e.target.value),
		[onChangeField],
	)
	const onChangeDescription = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("description", e.target.value),
		[onChangeField],
	)
	const onChangeIcon = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("icon", e.target.value),
		[onChangeField],
	)
	const onChangeColorFrom = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("color_from", e.target.value),
		[onChangeField],
	)
	const onChangeColorTo = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("color_to", e.target.value),
		[onChangeField],
	)
	const onChangeThreshold = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("threshold", e.target.value),
		[onChangeField],
	)
	const onChangeSortOrder = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) =>
			onChangeField("sort_order", e.target.value),
		[onChangeField],
	)

	const onSelectMetric = useCallback((option: MetricOption) => {
		setForm(prev => ({ ...prev, metric: option.value }))
	}, [])

	const onToggleActive = useCallback(
		(e: React.ChangeEvent<HTMLInputElement>) => {
			const checked = e.target.checked
			setForm(prev => ({ ...prev, is_active: checked }))
		},
		[],
	)

	useEffect(() => {
		if (!open) return
		setForm(achievement ? buildFormFromAchievement(achievement) : emptyForm)
	}, [achievement, open])

	const isSubmitDisabled = !canSubmit || isPending

	return (
		<Modal
			open={open}
			onClose={onCloseModal}
			title={title}
			className={styles.modal}
			contentClassName={styles.modalContent}
			actions={
				<>
					<Button className={styles.ghostBtn} onClick={onCloseModal}>
						Отмена
					</Button>
					<Button
						className={styles.primaryBtn}
						onClick={submitAction}
						disabled={isSubmitDisabled}
					>
						{isPending ? "Сохранение..." : "Сохранить"}
					</Button>
				</>
			}
		>
			<div className={styles.modalForm}>
				<label className={styles.field}>
					<span className={styles.label}>Код</span>
					<Input
						placeholder='first_card'
						value={form.code}
						onChange={onChangeCode}
					/>
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Название</span>
					<Input
						placeholder='Первые шаги'
						value={form.title}
						onChange={onChangeTitle}
					/>
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Описание</span>
					<Input
						placeholder='Создайте свою первую карточку'
						value={form.description}
						onChange={onChangeDescription}
					/>
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Иконка (emoji)</span>
					<Input placeholder='🌱' value={form.icon} onChange={onChangeIcon} />
				</label>

				<div className={styles.metaEdit}>
					<label className={styles.field}>
						<span className={styles.label}>Цвет от</span>
						<Input
							placeholder='#4FACFE'
							value={form.color_from}
							onChange={onChangeColorFrom}
						/>
					</label>
					<label className={styles.field}>
						<span className={styles.label}>Цвет до</span>
						<Input
							placeholder='#00F2FE'
							value={form.color_to}
							onChange={onChangeColorTo}
						/>
					</label>
				</div>

				<label className={styles.field}>
					<span className={styles.label}>Метрика</span>
					<Dropdown
						options={metricOptions}
						selected={selectedMetric}
						onSelect={onSelectMetric}
						labelKey='label'
						valueKey='value'
					/>
				</label>

				<div className={styles.metaEdit}>
					<label className={styles.field}>
						<span className={styles.label}>Порог</span>
						<Input
							placeholder='1'
							inputMode='numeric'
							value={form.threshold}
							onChange={onChangeThreshold}
						/>
					</label>
					<label className={styles.field}>
						<span className={styles.label}>Сортировка</span>
						<Input
							placeholder='1'
							inputMode='numeric'
							value={form.sort_order}
							onChange={onChangeSortOrder}
						/>
					</label>
				</div>

				<Checkbox
					label='Активно'
					checked={form.is_active}
					onChange={onToggleActive}
				/>

				{formError ? <div className={styles.formError}>{formError}</div> : <></>}
			</div>
		</Modal>
	)
}

export default AchievementModal
