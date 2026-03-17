import React, { useCallback, useMemo, useState } from "react"
import cn from "classnames"
import styles from "./Accordion.module.scss"

type Props = {
	header: React.ReactNode | ((open: boolean) => React.ReactNode)
	children: React.ReactNode
	className?: string
	headerClassName?: string
	contentClassName?: string
	chevronClassName?: string
	defaultOpen?: boolean
	open?: boolean
	onOpenChange?: (open: boolean) => void
}

const Accordion: React.FC<Props> = ({
	header,
	children,
	className,
	headerClassName,
	contentClassName,
	chevronClassName,
	defaultOpen = false,
	open,
	onOpenChange,
}) => {
	const [innerOpen, setInnerOpen] = useState(() => defaultOpen)
	const isControlled = useMemo(() => open !== undefined, [open])
	const isOpen = useMemo(
		() => (isControlled ? (open ?? false) : innerOpen),
		[innerOpen, isControlled, open],
	)

	const handleToggle = useCallback(() => {
		const next = !isOpen
		if (!isControlled) setInnerOpen(next)
		onOpenChange?.(next)
	}, [isControlled, isOpen, onOpenChange])

	const headerNode = useMemo(() => {
		return typeof header === "function" ? header(isOpen) : header
	}, [header, isOpen])

	const wrapperClassName = useMemo(
		() => cn(styles.accordion, className),
		[className],
	)
	const headerClasses = useMemo(
		() => cn(styles.header, headerClassName),
		[headerClassName],
	)
	const contentClasses = useMemo(
		() => cn(styles.content, contentClassName),
		[contentClassName],
	)
	const chevronClasses = useMemo(
		() =>
			cn(styles.chevron, chevronClassName, {
				[styles.chevronOpen]: isOpen,
			}),
		[chevronClassName, isOpen],
	)

	return (
		<div className={wrapperClassName} data-open={isOpen}>
			<button
				type='button'
				className={headerClasses}
				onClick={handleToggle}
				data-open={isOpen}
			>
				<div className={styles.headerInner}>
					<div className={styles.headerContent}>{headerNode}</div>
					<span className={chevronClasses} />
				</div>
			</button>
			<div className={contentClasses} data-open={isOpen}>
				{children}
			</div>
		</div>
	)
}

export default Accordion
