import React, { FC, memo, useMemo } from "react"
import cn from "classnames"
import styles from "./Tooltip.module.scss"
import { Icon } from "@assets/icons/Icon"

type TooltipProps = {
	children: React.ReactNode
	className?: string
	contentClassName?: string
	iconClassName?: string
}

const Tooltip: FC<TooltipProps> = memo(
	({ children, className, contentClassName, iconClassName }) => {
		const wrapperClassName = useMemo(
			() => cn(styles.tooltip, className),
			[className],
		)
		const contentClasses = useMemo(
			() => cn(styles.content, contentClassName),
			[contentClassName],
		)
		const iconClasses = useMemo(
			() => cn(styles.icon, iconClassName),
			[iconClassName],
		)

		return (
			<span className={wrapperClassName} tabIndex={0} aria-label='Подсказка'>
				<span className={iconClasses}>
					<Icon kind='svg' name='question-circle' width={15} height={15} />
				</span>

				<span className={contentClasses}>{children}</span>
			</span>
		)
	},
)

export default Tooltip
