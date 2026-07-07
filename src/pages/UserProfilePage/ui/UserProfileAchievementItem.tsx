import React, { memo, useCallback, useMemo } from "react"
import styles from "./UserProfileAchievements.module.scss"
import Badge from "@shared/Badge/Badge"
import Button from "@shared/Button/Button"
import { dateService } from "@shared/lib/date"
import { achievementMetricLabels } from "@shared/api/services/achievements/types"
import type { UserAchievement } from "@shared/api/services/userAchievements/types"

type Props = {
	achievement: UserAchievement
	onReset: (achievement: UserAchievement) => void
}

const UserProfileAchievementItem: React.FC<Props> = ({
	achievement,
	onReset,
}) => {
	const metricLabel = useMemo(
		() => achievementMetricLabels[achievement.metric],
		[achievement.metric],
	)

	const statusLabel = useMemo(
		() => (achievement.unlocked ? "Разблокировано" : "Заблокировано"),
		[achievement.unlocked],
	)

	const statusVariant = useMemo(
		() => (achievement.unlocked ? "success" : "neutral"),
		[achievement.unlocked],
	)

	const iconLabel = useMemo(() => achievement.icon || "🏆", [achievement.icon])

	const unlockedAtLabel = useMemo(() => {
		if (!achievement.unlocked_at) return "—"
		return dateService.format(achievement.unlocked_at) ?? "—"
	}, [achievement.unlocked_at])

	const progressLabel = useMemo(
		() =>
			`${achievement.progress_current}/${achievement.threshold} (${achievement.progress_percent}%)`,
		[
			achievement.progress_current,
			achievement.progress_percent,
			achievement.threshold,
		],
	)

	const onResetClick = useCallback(
		() => onReset(achievement),
		[achievement, onReset],
	)

	return (
		<div className={styles.row}>
			<span className={styles.colIcon}>
				<span className={styles.iconBadge}>{iconLabel}</span>
			</span>
			<span className={styles.colTitle}>
				<span className={styles.itemTitle}>{achievement.title}</span>
				<span className={styles.itemCode}>{achievement.code}</span>
			</span>
			<span className={styles.colMetric}>{metricLabel}</span>
			<span className={styles.colProgress}>{progressLabel}</span>
			<span className={styles.colStatus}>
				<Badge label={statusLabel} variant={statusVariant} />
			</span>
			<span className={styles.colDate}>{unlockedAtLabel}</span>
			<span className={styles.colActions}>
				<Button
					className={styles.resetBtn}
					onClick={onResetClick}
					disabled={!achievement.unlocked}
				>
					Сбросить
				</Button>
			</span>
		</div>
	)
}

export default memo(UserProfileAchievementItem)
