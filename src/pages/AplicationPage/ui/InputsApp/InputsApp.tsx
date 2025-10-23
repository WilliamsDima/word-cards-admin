import Input from "@shared/Input/Input"
import React, { ChangeEvent, useCallback, useEffect, useState } from "react"
import styles from "./InputsApp.module.scss"
import { useAppSelector } from "@shared/hooks/useStore"
import DoneIcon from "@assets/icons/done-green-48.svg?react"
import Loading from "@shared/Loading/Loading"
import {
	useChangeAppNameMutation,
	useChangeAppVersionMutation,
	useChangePrivacyPolicyLinkMutation,
} from "../../api/AppServices"

function InputsApp() {
	const { firebaseApp } = useAppSelector(store => store.app)

	const [appName, setAppName] = useState("")
	const [appNameIsChange, setAppNameIsChange] = useState(false)

	const [privacyPolicy, setPrivacyPolicy] = useState("")
	const [privacyPolicyIsChange, setPrivacyPolicyIsChange] = useState(false)

	const [appVersion, setAppVersion] = useState("")
	const [appVersionIsChange, setAppVersionIsChange] = useState(false)

	const [changeAppName, { isLoading: isLoadingAppName }] =
		useChangeAppNameMutation()

	const [changePrivacyPolicyLink, { isLoading: isLoadingPrivacyPolicy }] =
		useChangePrivacyPolicyLinkMutation()

	const [changeAppVersion, { isLoading: isLoadingAppVersion }] =
		useChangeAppVersionMutation()

	const onChangeNameApp = (e: ChangeEvent<HTMLInputElement>) => {
		setAppName(e.target.value)
		setAppNameIsChange(true)
	}

	const onChangePrivacyPolicy = (e: ChangeEvent<HTMLInputElement>) => {
		setPrivacyPolicy(e.target.value)
		setPrivacyPolicyIsChange(true)
	}

	const onChangeAppVersion = (e: ChangeEvent<HTMLInputElement>) => {
		setAppVersion(e.target.value)
		setAppVersionIsChange(true)
	}

	const saveAppName = useCallback(() => {
		setAppNameIsChange(false)
		changeAppName({ appName })
	}, [appName, changeAppName])

	const savePrivacyPolicy = useCallback(() => {
		setPrivacyPolicyIsChange(false)
		changePrivacyPolicyLink({ privacy_policy_link: privacyPolicy })
	}, [privacyPolicy, changePrivacyPolicyLink])

	const saveAppVersion = useCallback(() => {
		setAppVersionIsChange(false)
		changeAppVersion({ version: appVersion })
	}, [appVersion, changeAppVersion])

	useEffect(() => {
		setAppName(firebaseApp?.appName || "")
		setPrivacyPolicy(firebaseApp?.privacy_policy_link || "")
		setAppVersion(firebaseApp?.version || "")
	}, [firebaseApp])

	return (
		<div className={styles.inputs}>
			<div>
				<p className={styles.nameApp}>Название приложения</p>

				<div className={styles.inputWrapper}>
					<Input value={appName} onChange={onChangeNameApp} />
					{appNameIsChange && (
						<DoneIcon onClick={saveAppName} width={28} height={28} />
					)}
					{isLoadingAppName && <Loading className={styles.loader} />}
				</div>
			</div>

			<div>
				<p className={styles.nameApp}>Политика конфиденциальности</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={privacyPolicy}
						onChange={onChangePrivacyPolicy}
					/>
					{privacyPolicyIsChange && (
						<DoneIcon onClick={savePrivacyPolicy} width={28} height={28} />
					)}
					{isLoadingPrivacyPolicy && <Loading className={styles.loader} />}
				</div>
			</div>

			<div>
				<p className={styles.nameApp}>Версия приложения</p>

				<div className={styles.inputWrapper}>
					<Input type='link' value={appVersion} onChange={onChangeAppVersion} />
					{appVersionIsChange && (
						<DoneIcon onClick={saveAppVersion} width={28} height={28} />
					)}
					{isLoadingAppVersion && <Loading className={styles.loader} />}
				</div>
			</div>
		</div>
	)
}

export default InputsApp
