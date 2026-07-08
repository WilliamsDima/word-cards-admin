import { getAuthToken } from "@shared/lib/authToken"
import { refreshAuthToken } from "@shared/config/authClient"
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

const sendRequest = async <T>(
	path: string,
	options: RequestOptions,
	token: string | null,
): Promise<ServiceResult<T>> => {
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
		console.log("axios err", err)

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

export const request = async <T>(
	path: string,
	options: RequestOptions = {},
): Promise<ServiceResult<T>> => {
	// A caller-supplied token (e.g. the Google sign-in sync call) or an
	// explicit opt-out is never eligible for the stale-token retry below —
	// there is no cached session token to refresh in that flow.
	const usesCachedToken = !options.skipAuth && options.authToken === undefined
	const token = options.skipAuth ? null : (options.authToken ?? getAuthToken())

	const result = await sendRequest<T>(path, options, token)
	if (result.ok || result.error.status !== 401 || !usesCachedToken) return result

	// The cached Firebase ID token expired mid-session. Force a fresh one
	// and retry exactly once instead of surfacing a 401 the user can't act on.
	const freshToken = await refreshAuthToken()
	if (!freshToken || freshToken === token) return result

	return sendRequest<T>(path, options, freshToken)
}
