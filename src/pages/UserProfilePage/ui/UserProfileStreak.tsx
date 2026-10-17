import React, { useMemo } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileStreak.module.scss"
import Card from "@shared/Card/Card"
import Tooltip from "@shared/Tooltip/Tooltip"
import { dateService } from "@shared/lib/date"
import { useGetUserStreakQuery } from "@shared/api/services/userStreak/UserStreakQuery"
import UserProfileStreakForm from "./UserProfileStreakForm"
import UserProfileStreakFreezes from "./UserProfileStreakFreezes"

const formatNumber = (value: number) => value.toLocaleString("ru-RU")

const UserProfileStreak: React.FC = () => {
	const { id } = useParams()

	const { data, isLoading, error } = useGetUserStreakQuery(id ?? "", {
		skip: !id,
	})

	const lastCompletedLabel = useMemo(() => {
		if (!data?.last_completed_date) return "—"
		return dateService.formatISODate(data.last_completed_date) ?? "—"
	}, [data])

	const currentLabel = useMemo(
		() => (data ? formatNumber(data.current_streak) : "—"),
		[data],
	)

	const longestLabel = useMemo(
		() => (data ? formatNumber(data.longest_streak) : "—"),
		[data],
	)

	// Новые сохранённые значения пересоздают форму с актуальными данными
	const formKey = useMemo(
		() =>
			data
				? `${data.current_streak}-${data.longest_streak}-${data.last_completed_date ?? ""}`
				: "empty",
		[data],
	)

	const errorMessage = useMemo(() => {
		if (!error) return ""
		if ("status" in error && error.status === 404) return "Пользователь не найден"
		return "Не удалось загрузить серию пользователя"
	}, [error])

	return (
		<Card className={styles.streakCard}>
			<div className={styles.header}>
				<span className={styles.titleRow}>
					<h2 className={styles.title}>Серия дней (стрик)</h2>
					<Tooltip>
						Значения хранятся «как есть», без учёта пропусков: серия
						считается прерванной, если с даты последнего выполненного дня
						прошло больше одного дня. Мобильное приложение покажет 0, даже
						если здесь current_streak больше нуля.
					</Tooltip>
				</span>
				<p className={styles.hint}>
					Текущие значения и ручное восстановление серии пользователя
					(например, после сбоя).
				</p>
			</div>

			{isLoading ? (
				<div className={styles.loadingState}>Загружаем серию...</div>
			) : (
				<></>
			)}

			{errorMessage ? (
				<div className={styles.errorState}>{errorMessage}</div>
			) : (
				<></>
			)}

			{data ? (
				<>
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Сейчас</h3>
						<div className={styles.valuesGrid}>
							<div className={styles.valueCard}>
								<div className={styles.value}>{currentLabel}</div>
								<div className={styles.valueLabel}>Текущая серия</div>
							</div>
							<div className={styles.valueCard}>
								<div className={styles.value}>{longestLabel}</div>
								<div className={styles.valueLabel}>Лучшая серия</div>
							</div>
							<div className={styles.valueCard}>
								<div className={styles.value}>{lastCompletedLabel}</div>
								<div className={styles.valueLabel}>
									Последний выполненный день
								</div>
							</div>
						</div>
					</div>

					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Заморозки серии</h3>
						<UserProfileStreakFreezes streak={data} />
					</div>

					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Изменить</h3>
						<UserProfileStreakForm key={formKey} streak={data} />
					</div>
				</>
			) : (
				<></>
			)}
		</Card>
	)
}

export default UserProfileStreak
