import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./Toast.module.scss"
import cn from "classnames"
import type { ToastContextValue, ToastInput, ToastItem } from "./types"
import { ToastContext } from "./ToastContext"

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
	children,
}) => {
	const [toasts, setToasts] = useState<ToastItem[]>([])
	const timers = useRef<Map<string, number>>(new Map())

	const removeToast = useCallback((id: string) => {
		setToasts(prev => prev.filter(item => item.id !== id))
		const timerId = timers.current.get(id)
		if (timerId) {
			window.clearTimeout(timerId)
			timers.current.delete(id)
		}
	}, [])

	const push = useCallback(
		(toast: ToastInput) => {
			const id = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
			const item: ToastItem = {
				id,
				variant: toast.variant ?? "info",
				duration: toast.duration ?? 3500,
				...toast,
			}
			setToasts(prev => [item, ...prev].slice(0, 6))
			const timerId = window.setTimeout(() => removeToast(id), item.duration)
			timers.current.set(id, timerId)
		},
		[removeToast],
	)

	const value = useMemo<ToastContextValue>(
		() => ({
			push,
			success: (title, message) =>
				push({ title, message, variant: "success" }),
			error: (title, message) => push({ title, message, variant: "error" }),
			info: (title, message) => push({ title, message, variant: "info" }),
			warning: (title, message) =>
				push({ title, message, variant: "warning" }),
		}),
		[push],
	)

	useEffect(() => {
		return () => {
			timers.current.forEach(timerId => window.clearTimeout(timerId))
			timers.current.clear()
		}
	}, [])

	return (
		<ToastContext.Provider value={value}>
			{children}
			<div className={styles.container} aria-live='polite'>
				{toasts.map(toast => (
					<div
						key={toast.id}
						className={cn(styles.toast, styles[toast.variant])}
					>
						<div className={styles.content}>
							<div className={styles.title}>{toast.title}</div>
							{toast.message ? (
								<div className={styles.message}>{toast.message}</div>
							) : null}
						</div>
						<button
							className={styles.close}
							onClick={() => removeToast(toast.id)}
							aria-label='Закрыть'
							type='button'
						>
							×
						</button>
					</div>
				))}
			</div>
		</ToastContext.Provider>
	)
}
