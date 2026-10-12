import React, { useMemo } from "react"
import styles from "./UserProfileStats.module.scss"
import Dropdown from "@shared/Dropdown/Dropdown"
import type { YearOption } from "./UserProfileStats.types"

const TITLE = "Статистика пользователя"
const SUBTITLE = "Сводка по ключевым событиям и достижениям за выбранный год."
const SUBTITLE_ALL_TIME =
	"Сводка по ключевым событиям и достижениям за всё время. Лучший месяц — сумма по календарному месяцу за все годы."

type Props = {
	yearOptions: YearOption[]
	selectedYearOption: YearOption
	onYearSelect: (option: YearOption) => void
	isAllTime: boolean
}

const UserProfileStatsHeader: React.FC<Props> = ({
	yearOptions,
	selectedYearOption,
	onYearSelect,
	isAllTime,
}) => {
	const subtitle = useMemo(
		() => (isAllTime ? SUBTITLE_ALL_TIME : SUBTITLE),
		[isAllTime],
	)

	return (
		<div className={styles.statsHeader}>
			<div className={styles.statsTitleBlock}>
				<h2 className={styles.statsTitle}>{TITLE}</h2>
				<p className={styles.statsSubtitle}>{subtitle}</p>
			</div>
			<div className={styles.statsControls}>
				<span className={styles.statsControlLabel}>Период</span>
				<Dropdown
					options={yearOptions}
					selected={selectedYearOption}
					onSelect={onYearSelect}
					labelKey="label"
					valueKey="value"
				/>
			</div>
		</div>
	)
}

export default UserProfileStatsHeader
