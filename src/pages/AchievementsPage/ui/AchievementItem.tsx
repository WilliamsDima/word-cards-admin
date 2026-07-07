import React, { memo, useCallback, useMemo } from "react"
import cn from "classnames"
import Badge from "@shared/Badge/Badge"
import Button from "@shared/Button/Button"
import { Icon } from "@assets/icons/Icon"
import styles from "../AchievementsPage.module.scss"
import {
	achievementMetricLabels,
	type Achievement,
} from "@shared/api/services/achievements/types"

type Props = {
	achievement: Achievement
	onEdit: (achievement: Achievement) => void
	onDelete: (achievement: Achievement) => void
}

const AchievementItem: React.FC<Props> = ({ achievement, onEdit, onDelete }) => {
	const metricLabel = useMemo(
		() => achievementMetricLabels[achievement.metric],
		[achievement.metric],
	)

	const statusLabel = useMemo(
		() => (achievement.is_active ? "Активно" : "Скрыто"),
		[achievement.is_active],
	)

	const statusVariant = useMemo(
		() => (achievement.is_active ? "success" : "neutral"),
		[achievement.is_active],
	)

	const iconLabel = useMemo(() => achievement.icon || "🏆", [achievement.icon])

	const editButtonClassName = useMemo(
		() => cn(styles.iconButton, styles.iconButtonEdit),
		[],
	)
	const deleteButtonClassName = useMemo(
		() => cn(styles.iconButton, styles.iconButtonDanger),
		[],
	)

	const onEditClick = useCallback(() => onEdit(achievement), [achievement, onEdit])
	const onDeleteClick = useCallback(
		() => onDelete(achievement),
		[achievement, onDelete],
	)

	return (
		<div className={styles.row}>
			<span className={styles.colIcon}>
				<span className={styles.iconBadge}>{iconLabel}</span>
			</span>
			<span className={styles.colCode}>{achievement.code}</span>
			<span className={styles.colTitle}>{achievement.title}</span>
			<span className={styles.colMetric}>{metricLabel}</span>
			<span className={styles.colThreshold}>{achievement.threshold}</span>
			<span className={styles.colOrder}>{achievement.sort_order}</span>
			<span className={styles.colActive}>
				<Badge label={statusLabel} variant={statusVariant} />
			</span>
			<span className={styles.colActions}>
				<Button className={editButtonClassName} onClick={onEditClick}>
					<Icon kind='svg' name='edit' width={16} height={16} />
				</Button>
				<Button className={deleteButtonClassName} onClick={onDeleteClick}>
					<Icon kind='svg' name='delete-red-64' width={16} height={16} />
				</Button>
			</span>
		</div>
	)
}

export default memo(AchievementItem)
