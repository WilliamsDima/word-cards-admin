import { request } from "@shared/api/request"
import type { AuthMeResponse } from "./types"

class AuthService {
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
