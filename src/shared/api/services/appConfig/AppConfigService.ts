import { request } from "@shared/api/request"
import type { IAplication } from "./types"

class AppConfigService {
	getConfig() {
		return request<IAplication>("/app-config", { method: "GET" })
	}

	updateConfig(config: IAplication) {
		return request<IAplication>("/app-config", {
			method: "PUT",
			json: config,
		})
	}
}

export const appConfigService = new AppConfigService()
