import React, { useMemo } from "react"
import styles from "./UserProfileStats.module.scss"
import type { StatItem } from "./UserProfileStats.types"

type Variant = "primary" | "highlight"

type Props = {
	title: string
	items: StatItem[]
	variant: Variant
}

const UserProfileStatsSection: React.FC<Props> = ({ title, items, variant }) => {
	const gridClassName = useMemo(() => {
		return variant === "highlight" ? styles.highlightsGrid : styles.metricsGrid
	}, [variant])

	const cardClassName = useMemo(() => {
		return variant === "highlight" ? styles.highlightCard : styles.metricCard
	}, [variant])

	return (
		<div className={styles.section}>
			<h3 className={styles.sectionTitle}>{title}</h3>
			<div className={gridClassName}>
				{items.map(item => (
					<div key={item.id} className={cardClassName}>
						<div className={styles.metricValue}>{item.value}</div>
						<div className={styles.metricLabel}>{item.label}</div>
						{item.hint ? (
							<div className={styles.metricHint}>{item.hint}</div>
						) : null}
					</div>
				))}
			</div>
		</div>
	)
}

export default UserProfileStatsSection
