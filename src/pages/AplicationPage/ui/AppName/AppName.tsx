import Input from "@shared/Input/Input"
import React, { ChangeEvent, useCallback, useEffect, useState } from "react"
import styles from "./AppName.module.scss"
import { useAppSelector } from "@shared/hooks/useStore"
import DoneIcon from "@assets/icons/done-green-48.svg?react"
import Loading from "@shared/Loading/Loading"
import { useChangeAppNameMutation } from "../../api/AppServices"

function AppName() {
	const { firebaseApp } = useAppSelector(store => store.app)

	const [appName, setAppName] = useState("")
	const [appNameIsChange, setAppNameIsChange] = useState(false)

	const [changeAppName, { isLoading }] = useChangeAppNameMutation()

	const onChangeNameApp = (e: ChangeEvent<HTMLInputElement>) => {
		setAppName(e.target.value)
		setAppNameIsChange(true)
	}

	const save = useCallback(() => {
		setAppNameIsChange(false)
		changeAppName({ appName })
	}, [appName, changeAppName])

	useEffect(() => {
		setAppName(firebaseApp?.appName || "")
	}, [firebaseApp])

	return (
		<div>
			<p className={styles.nameApp}>Название приложения</p>

			<div className={styles.inputWrapper}>
				<Input value={appName} onChange={onChangeNameApp} />
				{appNameIsChange && <DoneIcon onClick={save} width={28} height={28} />}
				{isLoading && <Loading className={styles.loader} />}
			</div>
		</div>
	)
}

export default AppName
