import { request } from "@shared/api/request"
import type { AuthUser } from "./types"

class AuthService {
	me() {
		return request<AuthUser>("/admin/me", { method: "GET" })
	}

	googleSync(idToken: string) {
		return request<AuthUser>("/users/sync", {
			method: "POST",
			authToken: idToken,
		})
	}

	logout() {
		return request<void>("/auth/logout", { method: "POST" })
	}
}

export const authService = new AuthService()
