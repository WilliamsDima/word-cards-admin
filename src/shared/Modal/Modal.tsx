import React, { FC, useEffect } from "react"
import { createPortal } from "react-dom"
import cn from "classnames"
import styles from "./Modal.module.scss"
import Card from "@shared/Card/Card"

type Props = {
	open: boolean
	onClose: () => void
	title?: string
	children: React.ReactNode
	actions?: React.ReactNode
	className?: string
	contentClassName?: string
}

const Modal: FC<Props> = ({
	open,
	onClose,
	title,
	children,
	actions,
	className,
	contentClassName,
}) => {
	useEffect(() => {
		if (!open) return
		const onKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") onClose()
		}
		document.addEventListener("keydown", onKeyDown)
		return () => document.removeEventListener("keydown", onKeyDown)
	}, [open, onClose])

	if (!open) return null

	return createPortal(
		<div className={styles.backdrop} onClick={onClose}>
			<Card
				className={cn(styles.dialog, className)}
				onClick={event => event.stopPropagation()}
			>
				{title ? (
					<div className={styles.header}>
						<h3 className={styles.title}>{title}</h3>
					</div>
				) : null}
				<div className={cn(styles.content, contentClassName)}>{children}</div>
				{actions ? <div className={styles.footer}>{actions}</div> : null}
			</Card>
		</div>,
		document.body,
	)
}

export default Modal
