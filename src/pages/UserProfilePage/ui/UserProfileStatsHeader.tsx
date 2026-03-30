import React from "react"
import styles from "./UserProfileStats.module.scss"
import Dropdown from "@shared/Dropdown/Dropdown"
import type { YearOption } from "./UserProfileStats.types"

const TITLE = "Статистика пользователя"
const SUBTITLE = "Сводка по ключевым событиям и достижениям за выбранный год."

type Props = {
	yearOptions: YearOption[]
	selectedYearOption: YearOption
	onYearSelect: (option: YearOption) => void
}

const UserProfileStatsHeader: React.FC<Props> = ({
	yearOptions,
	selectedYearOption,
	onYearSelect,
}) => {
	return (
		<div className={styles.statsHeader}>
			<div className={styles.statsTitleBlock}>
				<h2 className={styles.statsTitle}>{TITLE}</h2>
				<p className={styles.statsSubtitle}>{SUBTITLE}</p>
			</div>
			<div className={styles.statsControls}>
				<span className={styles.statsControlLabel}>Год</span>
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
