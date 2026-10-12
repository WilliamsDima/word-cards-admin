import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileStreak.module.scss"
import Button from "@shared/Button/Button"
import Input from "@shared/Input/Input"
import { useToast } from "@shared/Toast/useToast"
import { useUpdateUserStreakMutation } from "@shared/api/services/userStreak/UserStreakQuery"
import {
	MAX_ADMIN_STREAK_VALUE,
	MIN_ADMIN_STREAK_DATE,
	type UserStreak,
} from "@shared/api/services/userStreak/types"
import {
	getDefaultStreakDate,
	getMaxStreakDate,
	validateStreakForm,
	type StreakFormValues,
} from "../lib/streakForm"

type Props = {
	streak: UserStreak
}

const buildInitialValues = (streak: UserStreak): StreakFormValues => ({
	currentStreak: String(streak.current_streak),
	longestStreak: String(streak.longest_streak),
	lastCompletedDate: getDefaultStreakDate(),
})

const UserProfileStreakForm: React.FC<Props> = ({ streak }) => {
	const { id } = useParams()

	const [values, setValues] = useState<StreakFormValues>(() =>
		buildInitialValues(streak),
	)

	const [updateUserStreak, { isLoading }] = useUpdateUserStreakMutation()
	const toast = useToast()

	const maxDate = useMemo(() => getMaxStreakDate(), [])
	const defaultDate = useMemo(() => getDefaultStreakDate(), [])

	const validation = useMemo(
		() => validateStreakForm(values, maxDate),
		[maxDate, values],
	)

	const isDateStale = useMemo(
		() =>
			!validation.errors.lastCompletedDate &&
			values.lastCompletedDate < defaultDate,
		[defaultDate, validation.errors.lastCompletedDate, values.lastCompletedDate],
	)

	const willRaiseLongest = useMemo(() => {
		const parsed = validation.parsed
		if (!parsed) return false
		const nextLongest =
			parsed.longest_streak ??
			Math.max(streak.longest_streak, parsed.current_streak)
		return nextLongest > streak.longest_streak
	}, [streak.longest_streak, validation.parsed])

	const isSubmitDisabled = useMemo(
		() => isLoading || !validation.parsed || !id,
		[id, isLoading, validation.parsed],
	)

	const onCurrentChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target
			setValues(prev => ({ ...prev, currentStreak: value }))
		},
		[],
	)

	const onLongestChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target
			setValues(prev => ({ ...prev, longestStreak: value }))
		},
		[],
	)

	const onDateChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			const { value } = event.target
			setValues(prev => ({ ...prev, lastCompletedDate: value }))
		},
		[],
	)

	const onResetForm = useCallback(() => {
		setValues(buildInitialValues(streak))
	}, [streak])

	const onSubmit = useCallback(
		async (event: React.FormEvent<HTMLFormElement>) => {
			event.preventDefault()
			const parsed = validation.parsed
			if (!parsed || !id) return
			try {
				await updateUserStreak({ userId: id, ...parsed }).unwrap()
				toast.success(
					"Серия обновлена",
					`Текущая серия: ${parsed.current_streak}`,
				)
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось обновить серию",
				)
			}
		},
		[id, toast, updateUserStreak, validation.parsed],
	)

	return (
		<form className={styles.form} onSubmit={onSubmit} noValidate>
			<div className={styles.fieldsGrid}>
				<label className={styles.field}>
					<span className={styles.label}>Текущая серия (current_streak)</span>
					<Input
						type='number'
						inputMode='numeric'
						min={0}
						max={MAX_ADMIN_STREAK_VALUE}
						step={1}
						value={values.currentStreak}
						onChange={onCurrentChange}
						isError={Boolean(validation.errors.currentStreak)}
					/>
					{validation.errors.currentStreak ? (
						<span className={styles.fieldError}>
							{validation.errors.currentStreak}
						</span>
					) : (
						<></>
					)}
				</label>

				<label className={styles.field}>
					<span className={styles.label}>Лучшая серия (longest_streak)</span>
					<Input
						type='number'
						inputMode='numeric'
						min={0}
						max={MAX_ADMIN_STREAK_VALUE}
						step={1}
						value={values.longestStreak}
						onChange={onLongestChange}
						isError={Boolean(validation.errors.longestStreak)}
					/>
					{validation.errors.longestStreak ? (
						<span className={styles.fieldError}>
							{validation.errors.longestStreak}
						</span>
					) : (
						<span className={styles.fieldHint}>
							Не меньше текущей. Пусто — max(сохранённая, текущая).
						</span>
					)}
				</label>

				<label className={styles.field}>
					<span className={styles.label}>
						Последний выполненный день (last_completed_date)
					</span>
					<Input
						type='date'
						className={styles.dateInput}
						min={MIN_ADMIN_STREAK_DATE}
						max={maxDate}
						value={values.lastCompletedDate}
						onChange={onDateChange}
						isError={Boolean(validation.errors.lastCompletedDate)}
					/>
					{validation.errors.lastCompletedDate ? (
						<span className={styles.fieldError}>
							{validation.errors.lastCompletedDate}
						</span>
					) : (
						<></>
					)}
				</label>
			</div>

			<p className={styles.hint}>
				Серия жива, пока сегодня — это дата или следующий день. По умолчанию
				подставлено «вчера» по вашему локальному времени: серия сохранится, и
				пользователь продолжит её сегодня. «Сегодня» — день уже засчитан,
				продолжение завтра.
			</p>

			{isDateStale ? (
				<p className={styles.warning}>
					Дата раньше вчерашней: мобильное приложение сочтёт серию прерванной
					и покажет 0.
				</p>
			) : (
				<></>
			)}

			{willRaiseLongest ? (
				<p className={styles.warning}>
					Лучшая серия увеличится — это может разблокировать достижения
					«Самая длинная серия дней».
				</p>
			) : (
				<></>
			)}

			<div className={styles.actions}>
				<Button
					type='submit'
					className={styles.primaryBtn}
					disabled={isSubmitDisabled}
				>
					{isLoading ? "Сохранение..." : "Сохранить"}
				</Button>
				<Button
					className={styles.ghostBtn}
					onClick={onResetForm}
					disabled={isLoading}
				>
					Вернуть текущие значения
				</Button>
			</div>
		</form>
	)
}

export default UserProfileStreakForm
