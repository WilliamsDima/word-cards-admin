import React, { useCallback, useMemo, useState } from "react"
import cn from "classnames"
import styles from "./Accordion.module.scss"

type Props = {
	header: React.ReactNode | ((open: boolean) => React.ReactNode)
	children: React.ReactNode
	className?: string
	headerClassName?: string
	contentClassName?: string
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
	defaultOpen = false,
	open,
	onOpenChange,
}) => {
	const [innerOpen, setInnerOpen] = useState(defaultOpen)
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

	return (
		<div className={wrapperClassName} data-open={isOpen}>
			<button
				type='button'
				className={headerClasses}
				onClick={handleToggle}
				data-open={isOpen}
			>
				{headerNode}
			</button>
			<div className={contentClasses} data-open={isOpen}>
				{children}
			</div>
		</div>
	)
}

export default Accordion
