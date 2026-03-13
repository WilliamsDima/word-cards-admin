import { request } from "@shared/api/request"
import type { LanguageItem, LanguagePayload, LanguagesMap } from "@shared/api/types"

class LanguagesService {
	getLanguages() {
		return request<LanguagesMap>("/languages", { method: "GET" })
	}

	createLanguage(payload: LanguagePayload) {
		return request<LanguageItem>("/languages", {
			method: "POST",
			json: payload,
		})
	}

	updateLanguage(id: number, payload: LanguagePayload) {
		return request<LanguageItem>(`/languages/${id}`, {
			method: "PUT",
			json: payload,
		})
	}

	deleteLanguage(id: number) {
		return request<{ ok: true }>(`/languages/${id}`, {
			method: "DELETE",
		})
	}
}

export const languagesService = new LanguagesService()
