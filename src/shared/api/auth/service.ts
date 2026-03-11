import { request } from "@shared/api/request"
import type { AuthLoginRequest, AuthLoginResponse, AuthMeResponse } from "./types"

class AuthService {
	login(body: AuthLoginRequest) {
		return request<AuthLoginResponse>("/auth/login", {
			method: "POST",
			json: body,
		})
	}

	me() {
		return request<AuthMeResponse>("/auth/me", { method: "GET" })
	}

	googleSync(idToken: string) {
		return request<AuthMeResponse>("/users/sync", {
			method: "POST",
			authToken: idToken,
		})
	}

	logout() {
		return request<void>("/auth/logout", { method: "POST" })
	}
}

export const authService = new AuthService()
