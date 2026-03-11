export type ServiceError = {
	status: number | "FETCH_ERROR" | "CUSTOM_ERROR"
	message: string
	data?: unknown
}

export type ServiceOk<T> = {
	ok: true
	data: T
}

export type ServiceFail = {
	ok: false
	error: ServiceError
}

export type ServiceResult<T> = ServiceOk<T> | ServiceFail
