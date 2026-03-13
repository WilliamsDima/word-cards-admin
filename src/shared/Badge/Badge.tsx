import React, { memo, useMemo } from "react"
import cn from "classnames"
import styles from "./Badge.module.scss"

export type BadgeVariant = "neutral" | "warning" | "success" | "info"

type Props = {
	label: string
	variant?: BadgeVariant
	className?: string
}

const Badge: React.FC<Props> = memo(({ label, variant = "neutral", className }) => {
	const badgeClassName = useMemo(
		() => cn(styles.badge, styles[variant], className),
		[className, variant],
	)

	return <span className={badgeClassName}>{label}</span>
})

export default Badge
