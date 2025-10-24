import {
	useChangeAppNameMutation,
	useChangeAppVersionMutation,
	useChangeGooglePlayMutation,
	useChangePrivacyPolicyLinkMutation,
} from "@pages/AplicationPage/api/AppServices"
import { useAppSelector } from "@shared/hooks/useStore"
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
	const { firebaseApp } = useAppSelector(store => store.app)

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

	const [changeAppName, { isLoading: isLoadingAppName }] =
		useChangeAppNameMutation()

	const [changePrivacyPolicyLink, { isLoading: isLoadingPrivacyPolicy }] =
		useChangePrivacyPolicyLinkMutation()

	const [changeAppVersion, { isLoading: isLoadingAppVersion }] =
		useChangeAppVersionMutation()

	const [changeGooglePlay, { isLoading: isLoadingChangeGooglePlay }] =
		useChangeGooglePlayMutation()

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
		[]
	)

	const onSaveHandler = useCallback(
		(key: INPUTSKeys) => {
			setInputData(prev => {
				return {
					...prev,
					[key]: {
						...prev[key],
						change: false,
					},
				}
			})

			if (key === INPUTS.appName) {
				changeAppName({ appName: inputData[INPUTS.appName].value })
			} else if (key === INPUTS.privacyPolicy) {
				changePrivacyPolicyLink({
					privacy_policy_link: inputData[INPUTS.privacyPolicy].value,
				})
			} else if (key === INPUTS.appVersion) {
				changeAppVersion({ version: inputData[INPUTS.appVersion].value })
			} else if (key === INPUTS.googlePlayIcon) {
				changeGooglePlay({
					icon: inputData[INPUTS.googlePlayIcon].value,
					link: inputData[INPUTS.googlePlayLink].value,
				})
			} else if (key === INPUTS.googlePlayLink) {
				changeGooglePlay({
					icon: inputData[INPUTS.googlePlayIcon].value,
					link: inputData[INPUTS.googlePlayLink].value,
				})
			} else {
				return
			}
		},
		[
			changeAppName,
			changeAppVersion,
			changePrivacyPolicyLink,
			changeGooglePlay,
			inputData,
		]
	)

	useEffect(() => {
		setInputData(prev => {
			return {
				[INPUTS.appName]: {
					value: prev[INPUTS.appName].change
						? prev[INPUTS.appName].value
						: firebaseApp?.appName || "",
					change: prev[INPUTS.appName].change,
				},
				[INPUTS.privacyPolicy]: {
					value: prev[INPUTS.privacyPolicy].change
						? prev[INPUTS.privacyPolicy].value
						: firebaseApp?.privacy_policy_link || "",
					change: prev[INPUTS.privacyPolicy].change,
				},
				[INPUTS.appVersion]: {
					value: prev[INPUTS.appVersion].change
						? prev[INPUTS.appVersion].value
						: firebaseApp?.version || "",
					change: prev[INPUTS.appVersion].change,
				},
				[INPUTS.googlePlayIcon]: {
					value: prev[INPUTS.googlePlayIcon].change
						? prev[INPUTS.googlePlayIcon].value
						: firebaseApp?.developer.icon || "",
					change: prev[INPUTS.googlePlayIcon].change,
				},
				[INPUTS.googlePlayLink]: {
					value: prev[INPUTS.googlePlayLink].change
						? prev[INPUTS.googlePlayLink].value
						: firebaseApp?.developer.link || "",
					change: prev[INPUTS.googlePlayLink].change,
				},
			}
		})
	}, [firebaseApp])

	return {
		isLoadingAppName,
		isLoadingPrivacyPolicy,
		isLoadingAppVersion,
		isLoadingChangeGooglePlay,
		inputData,
		onChangeHandler,
		onSaveHandler,
	}
}
