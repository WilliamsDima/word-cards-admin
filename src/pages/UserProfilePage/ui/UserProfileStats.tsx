import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileStats.module.scss"
import Card from "@shared/Card/Card"
import Dropdown from "@shared/Dropdown/Dropdown"
import Skeleton from "@shared/Skeleton/Skeleton"
import { useGetUserYearStatsQuery } from "@shared/api/services/userStats/UserStatsQuery"

const YEARS_RANGE = 2

type YearOption = {
	label: string
	value: number
}

type StatItem = {
	id: string
	label: string
	value: string
	hint?: string
}

const UserProfileStats = () => {
	const { id } = useParams()
	const [selectedYear, setSelectedYear] = useState<number>(() =>
		new Date().getFullYear(),
	)

	const { data, isLoading, isFetching, error } = useGetUserYearStatsQuery(
		{
			userId: id ?? "",
			year: selectedYear,
		},
		{ skip: !id },
	)

	const yearOptions = useMemo<YearOption[]>(() => {
		const currentYear = new Date().getFullYear()
		return Array.from({ length: YEARS_RANGE }, (_value, index) => {
			const value = currentYear - index
			return {
				label: String(value),
				value,
			}
		})
	}, [])

	const selectedYearOption = useMemo<YearOption>(() => {
		return (
			yearOptions.find(option => option.value === selectedYear) ??
			yearOptions[0]
		)
	}, [selectedYear, yearOptions])

	const isBusy = useMemo(() => isLoading || isFetching, [isFetching, isLoading])

	const monthLabels = useMemo(
		() => [
			"Январь",
			"Февраль",
			"Март",
			"Апрель",
			"Май",
			"Июнь",
			"Июль",
			"Август",
			"Сентябрь",
			"Октябрь",
			"Ноябрь",
			"Декабрь",
		],
		[],
	)

	const bestMonthLabel = useMemo(() => {
		if (!data?.best_month) return "—"
		const monthName = monthLabels[data.best_month - 1]
		return monthName ?? "—"
	}, [data, monthLabels])

	const formatNumber = useCallback((value: number | null | undefined) => {
		if (typeof value !== "number") return "—"
		return value.toLocaleString("ru-RU")
	}, [])

	const primaryMetrics = useMemo<StatItem[]>(() => {
		if (!data) return []

		return [
			{
				id: "app_opens",
				label: "Открытий приложения",
				value: formatNumber(data.app_opens),
			},
			{
				id: "cards_created",
				label: "Создано карточек",
				value: formatNumber(data.cards_created),
			},
			{
				id: "cards_reviewed",
				label: "Повторений карточек",
				value: formatNumber(data.cards_reviewed),
			},
			{
				id: "trainings_count",
				label: "Тренировок",
				value: formatNumber(data.trainings_count),
			},
			{
				id: "ads_viewed",
				label: "Просмотров рекламы",
				value: formatNumber(data.ads_viewed),
			},
		]
	}, [data, formatNumber])

	const highlightMetrics = useMemo<StatItem[]>(() => {
		if (!data) return []

		const bestMonthCards = formatNumber(data.best_month_cards_created)
		const streakValue =
			typeof data.longest_streak === "number"
				? `${formatNumber(data.longest_streak)} дней`
				: "—"

		return [
			{
				id: "best_month",
				label: "Лучший месяц",
				value: bestMonthLabel,
				hint: `Карточек создано: ${bestMonthCards}`,
			},
			{
				id: "longest_streak",
				label: "Самая длинная серия",
				value: streakValue,
				hint: "Дней подряд в приложении",
			},
		]
	}, [bestMonthLabel, data, formatNumber])

	const errorMessage = useMemo(() => {
		if (!error) return ""
		if ("status" in error) {
			if (error.status === 401) return "Нет токена для запроса статистики"
			if (error.status === 403)
				return "Недостаточно прав для просмотра статистики"
			if (error.status === 404) return "Пользователь не найден"
		}
		return "Не удалось загрузить статистику"
	}, [error])

	const onYearSelect = useCallback((option: YearOption) => {
		setSelectedYear(option.value)
	}, [])

	return (
		<Card className={styles.statsCard}>
			<div className={styles.statsHeader}>
				<div className={styles.statsTitleBlock}>
					<h2 className={styles.statsTitle}>Статистика пользователя</h2>
					<p className={styles.statsSubtitle}>
						Сводка по ключевым событиям и достижениям за выбранный год.
					</p>
				</div>
				<div className={styles.statsControls}>
					<span className={styles.statsControlLabel}>Год</span>
					<Dropdown
						options={yearOptions}
						selected={selectedYearOption}
						onSelect={onYearSelect}
						labelKey='label'
						valueKey='value'
					/>
				</div>
			</div>

			{isBusy && !data ? (
				<div className={styles.statsSkeleton}>
					<Skeleton className={styles.skeletonTile} />
					<Skeleton className={styles.skeletonTile} />
					<Skeleton className={styles.skeletonTile} />
					<Skeleton className={styles.skeletonTile} />
					<Skeleton className={styles.skeletonTile} />
					<Skeleton className={styles.skeletonTile} />
				</div>
			) : null}

			{errorMessage ? (
				<div className={styles.errorState}>{errorMessage}</div>
			) : null}

			{!data && !isBusy && !errorMessage ? (
				<div className={styles.emptyState}>Нет данных за выбранный год</div>
			) : null}

			{data && !isBusy ? (
				<div className={styles.statsBody}>
					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Активность</h3>
						<div className={styles.metricsGrid}>
							{primaryMetrics.map(metric => (
								<div key={metric.id} className={styles.metricCard}>
									<div className={styles.metricValue}>{metric.value}</div>
									<div className={styles.metricLabel}>{metric.label}</div>
									{metric.hint ? (
										<div className={styles.metricHint}>{metric.hint}</div>
									) : null}
								</div>
							))}
						</div>
					</div>

					<div className={styles.section}>
						<h3 className={styles.sectionTitle}>Достижения</h3>
						<div className={styles.highlightsGrid}>
							{highlightMetrics.map(metric => (
								<div key={metric.id} className={styles.highlightCard}>
									<div className={styles.metricValue}>{metric.value}</div>
									<div className={styles.metricLabel}>{metric.label}</div>
									{metric.hint ? (
										<div className={styles.metricHint}>{metric.hint}</div>
									) : null}
								</div>
							))}
						</div>
					</div>
				</div>
			) : null}
		</Card>
	)
}

export default UserProfileStats
