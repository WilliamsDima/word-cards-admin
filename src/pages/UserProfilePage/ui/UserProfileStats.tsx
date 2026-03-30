import React, { useCallback, useMemo, useState } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileStats.module.scss"
import Card from "@shared/Card/Card"
import { useGetUserYearStatsQuery } from "@shared/api/services/userStats/UserStatsQuery"
import { dateService } from "@shared/lib/date"
import UserProfileStatsHeader from "./UserProfileStatsHeader"
import UserProfileStatsSection from "./UserProfileStatsSection"
import UserProfileStatsSkeleton from "./UserProfileStatsSkeleton"
import type { StatItem, YearOption } from "./UserProfileStats.types"

const YEARS_RANGE = 5

const formatNumber = (value: number | null | undefined) =>
	value?.toLocaleString("ru-RU") || ""

const UserProfileStats = () => {
	const { id } = useParams()
	const [selectedYear, setSelectedYear] = useState<number>(() =>
		dateService.getCurrentYear(),
	)

	const { data, isLoading, isFetching, error } = useGetUserYearStatsQuery(
		{
			userId: id ?? "",
			year: selectedYear,
		},
		{ skip: !id },
	)

	const yearOptions = useMemo<YearOption[]>(() => {
		const currentYear = dateService.getCurrentYear()
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

	const bestMonthLabel = useMemo(() => {
		if (!data?.best_month) return "—"
		const monthLabel = dateService.getMonthLabel(data.best_month)
		return monthLabel ?? "—"
	}, [data])

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
	}, [data])

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
	}, [bestMonthLabel, data])

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
			<UserProfileStatsHeader
				yearOptions={yearOptions}
				selectedYearOption={selectedYearOption}
				onYearSelect={onYearSelect}
			/>

			{isBusy && !data ? <UserProfileStatsSkeleton /> : null}

			{errorMessage ? (
				<div className={styles.errorState}>{errorMessage}</div>
			) : null}

			{!data && !isBusy && !errorMessage ? (
				<div className={styles.emptyState}>Нет данных за выбранный год</div>
			) : null}

			{data && !isBusy ? (
				<div className={styles.statsBody}>
					<UserProfileStatsSection
						title='Активность'
						items={primaryMetrics}
						variant='primary'
					/>
					<UserProfileStatsSection
						title='Достижения'
						items={highlightMetrics}
						variant='highlight'
					/>
				</div>
			) : null}
		</Card>
	)
}

export default UserProfileStats
