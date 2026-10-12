import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { type ChangeEvent, useCallback, useEffect, useState } from "react"
import { useToast } from "@shared/Toast/useToast"

export const INPUTS = {
	appName: "appName",
	privacyPolicy: "privacyPolicy",
	appVersion: "appVersion",
	developerIcon: "developerIcon",
	developerLink: "developerLink",
} as const

type INPUTSKeys = keyof typeof INPUTS

export const useInputsApp = () => {
	const { data } = useGetAppConfigQuery()
	const [updateConfig, { isLoading: isSaving }] =
		useUpdateAppConfigMutation()
	const toast = useToast()
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
		[INPUTS.developerIcon]: {
			value: "",
			change: false,
		},
		[INPUTS.developerLink]: {
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
					icon: inputData[INPUTS.developerIcon].value,
					link: inputData[INPUTS.developerLink].value,
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
				toast.success("Настройки обновлены")
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error("Ошибка сохранения", serverError || "Не удалось сохранить")
			} finally {
				setSavingKey(null)
			}
		},
		[data, inputData, updateConfig, toast],
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
				[INPUTS.developerIcon]: {
					value: prev[INPUTS.developerIcon].change
						? prev[INPUTS.developerIcon].value
						: data?.developer.icon || "",
					change: prev[INPUTS.developerIcon].change,
				},
				[INPUTS.developerLink]: {
					value: prev[INPUTS.developerLink].change
						? prev[INPUTS.developerLink].value
						: data?.developer.link || "",
					change: prev[INPUTS.developerLink].change,
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
