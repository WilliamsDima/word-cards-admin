import { getAuthToken } from "@shared/lib/authToken"
import type { ServiceResult } from "./result"

type RequestOptions = {
	method?: string
	headers?: HeadersInit
	body?: BodyInit | null
	json?: unknown
	authToken?: string | null
	skipAuth?: boolean
}

const getApiBaseUrl = () => import.meta.env.VITE_API_BASE_URL

export const request = async <T>(
	path: string,
	options: RequestOptions = {},
): Promise<ServiceResult<T>> => {
	const url = `${getApiBaseUrl()}${path}`
	const token = options.skipAuth ? null : (options.authToken ?? getAuthToken())
	const headers = new Headers(options.headers)

	if (token) headers.set("Authorization", `Bearer ${token}`)
	if (options.json !== undefined && !headers.has("Content-Type")) {
		headers.set("Content-Type", "application/json")
	}

	const init: RequestInit = {
		method: options.method ?? "GET",
		headers,
		body:
			options.json !== undefined
				? JSON.stringify(options.json)
				: (options.body ?? null),
	}

	try {
		const res = await fetch(url, init)
		const contentType = res.headers.get("content-type") ?? ""
		const data = contentType.includes("application/json")
			? await res.json()
			: await res.text()

		if (!res.ok) {
			return {
				ok: false,
				error: {
					status: res.status,
					message: res.statusText || "Request failed",
					data,
				},
			}
		}

		return { ok: true, data: data as T }
	} catch (err) {
		return {
			ok: false,
			error: {
				status: "FETCH_ERROR",
				message: err instanceof Error ? err.message : "Network error",
			},
		}
	}
}
