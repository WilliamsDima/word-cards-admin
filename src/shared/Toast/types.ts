export type ToastVariant = "success" | "error" | "info" | "warning"

export type ToastInput = {
	title: string
	message?: string
	variant?: ToastVariant
	duration?: number
}

export type ToastItem = ToastInput & {
	id: string
	variant: ToastVariant
	duration: number
}

export type ToastContextValue = {
	push: (toast: ToastInput) => void
	success: (title: string, message?: string) => void
	error: (title: string, message?: string) => void
	info: (title: string, message?: string) => void
	warning: (title: string, message?: string) => void
}
