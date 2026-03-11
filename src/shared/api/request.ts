import { getAuthToken } from "@shared/lib/authToken"
import type { ServiceResult } from "./result"
import { http } from "./http"

type RequestOptions = {
	method?: string
	headers?: Record<string, string>
	body?: unknown
	json?: unknown
	authToken?: string | null
	skipAuth?: boolean
}

export const request = async <T>(
	path: string,
	options: RequestOptions = {},
): Promise<ServiceResult<T>> => {
	const token = options.skipAuth ? null : (options.authToken ?? getAuthToken())
	const headers = {
		...(options.headers ?? {}),
		...(token ? { Authorization: `Bearer ${token}` } : {}),
	}

	try {
		const res = await http.request({
			url: path,
			method: options.method ?? "GET",
			headers,
			data: options.json !== undefined ? options.json : (options.body ?? null),
			validateStatus: () => true,
		})

		if (res.status < 200 || res.status >= 300) {
			return {
				ok: false,
				error: {
					status: res.status,
					message: res.statusText || "Request failed",
					data: res.data,
				},
			}
		}

		return { ok: true, data: res.data as T }
	} catch (err) {
		if (typeof err === "object" && err && "response" in err) {
			const error = err as { response?: { status?: number; data?: unknown } }
			return {
				ok: false,
				error: {
					status: error.response?.status ?? "FETCH_ERROR",
					message: "Request failed",
					data: error.response?.data,
				},
			}
		}
		return {
			ok: false,
			error: {
				status: "FETCH_ERROR",
				message: err instanceof Error ? err.message : "Network error",
			},
		}
	}
}
