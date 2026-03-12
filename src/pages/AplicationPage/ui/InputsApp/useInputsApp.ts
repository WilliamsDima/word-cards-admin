import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { ChangeEvent, useCallback, useEffect, useState } from "react"

export const INPUTS = {
	appName: "appName",
	privacyPolicy: "privacyPolicy",
	appVersion: "appVersion",
	googlePlayIcon: "googlePlayIcon",
	googlePlayLink: "googlePlayLink",
} as const

type INPUTSKeys = keyof typeof INPUTS

export const useInputsApp = () => {
	const { data } = useGetAppConfigQuery()
	const [updateConfig, { isLoading: isSaving }] =
		useUpdateAppConfigMutation()
	const [savingKey, setSavingKey] = useState<INPUTSKeys | null>(null)

	const [inputData, setInputData] = useState({
		[INPUTS.appName]: {
			value: "",
			change: false,
		},
		[INPUTS.privacyPolicy]: {
			value: "",
			change: false,
		},
		[INPUTS.appVersion]: {
			value: "",
			change: false,
		},
		[INPUTS.googlePlayIcon]: {
			value: "",
			change: false,
		},
		[INPUTS.googlePlayLink]: {
			value: "",
			change: false,
		},
	})

	const onChangeHandler = useCallback(
		(key: INPUTSKeys, e: ChangeEvent<HTMLInputElement>) => {
			setInputData(prev => {
				return {
					...prev,
					[key]: {
						change: true,
						value: e.target.value,
					},
				}
			})
		},
		[],
	)

	const onSaveHandler = useCallback(
		async (key: INPUTSKeys) => {
			if (!data) return
			setSavingKey(key)

			const nextConfig = {
				...data,
				appName: inputData[INPUTS.appName].value,
				version: inputData[INPUTS.appVersion].value,
				privacy_policy_link: inputData[INPUTS.privacyPolicy].value,
				developer: {
					...data.developer,
					icon: inputData[INPUTS.googlePlayIcon].value,
					link: inputData[INPUTS.googlePlayLink].value,
				},
			}

			try {
				await updateConfig(nextConfig).unwrap()
				setInputData(prev => {
					return {
						...prev,
						[key]: {
							...prev[key],
							change: false,
						},
					}
				})
			} finally {
				setSavingKey(null)
			}
		},
		[data, inputData, updateConfig],
	)

	useEffect(() => {
		setInputData(prev => {
			return {
				[INPUTS.appName]: {
					value: prev[INPUTS.appName].change
						? prev[INPUTS.appName].value
						: data?.appName || "",
					change: prev[INPUTS.appName].change,
				},
				[INPUTS.privacyPolicy]: {
					value: prev[INPUTS.privacyPolicy].change
						? prev[INPUTS.privacyPolicy].value
						: data?.privacy_policy_link || "",
					change: prev[INPUTS.privacyPolicy].change,
				},
				[INPUTS.appVersion]: {
					value: prev[INPUTS.appVersion].change
						? prev[INPUTS.appVersion].value
						: data?.version || "",
					change: prev[INPUTS.appVersion].change,
				},
				[INPUTS.googlePlayIcon]: {
					value: prev[INPUTS.googlePlayIcon].change
						? prev[INPUTS.googlePlayIcon].value
						: data?.developer.icon || "",
					change: prev[INPUTS.googlePlayIcon].change,
				},
				[INPUTS.googlePlayLink]: {
					value: prev[INPUTS.googlePlayLink].change
						? prev[INPUTS.googlePlayLink].value
						: data?.developer.link || "",
					change: prev[INPUTS.googlePlayLink].change,
				},
			}
		})
	}, [data])

	return {
		inputData,
		onChangeHandler,
		onSaveHandler,
		isSaving,
		savingKey,
	}
}
