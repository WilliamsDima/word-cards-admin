import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { appConfigService } from "./AppConfigService"
import type { IAplication } from "@shared/api/types"

export const appConfigAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getAppConfig: builder.query<IAplication, void>({
			async queryFn() {
				return toRtkQueryResult(await appConfigService.getConfig())
			},
			providesTags: ["app"],
		}),
		updateAppConfig: builder.mutation<IAplication, IAplication>({
			async queryFn(config) {
				return toRtkQueryResult(await appConfigService.updateConfig(config))
			},
			invalidatesTags: ["app"],
		}),
	}),
})

export const { useGetAppConfigQuery, useUpdateAppConfigMutation } = appConfigAPI
