import Input from "@shared/Input/Input"
import React from "react"
import styles from "./InputsApp.module.scss"
import DoneIcon from "@assets/icons/done-green-48.svg?react"
import Loading from "@shared/Loading/Loading"
import { INPUTS, useInputsApp } from "./useInputsApp"

function InputsApp() {
	const {
		isLoadingAppName,
		isLoadingAppVersion,
		isLoadingPrivacyPolicy,
		isLoadingChangeGooglePlay,
		inputData,
		onChangeHandler,
		onSaveHandler,
	} = useInputsApp()

	return (
		<div className={styles.inputs}>
			<div>
				<p className={styles.blockName}>Название приложения</p>

				<div className={styles.inputWrapper}>
					<Input
						value={inputData[INPUTS.appName].value}
						onChange={e => onChangeHandler(INPUTS.appName, e)}
					/>
					{inputData[INPUTS.appName].change && (
						<DoneIcon
							onClick={() => onSaveHandler(INPUTS.appName)}
							width={28}
							height={28}
						/>
					)}
					{isLoadingAppName && <Loading className={styles.loader} />}
				</div>
			</div>

			<div>
				<p className={styles.blockName}>Политика конфиденциальности</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.privacyPolicy].value}
						onChange={e => onChangeHandler(INPUTS.privacyPolicy, e)}
					/>
					{inputData[INPUTS.privacyPolicy].change && (
						<DoneIcon
							onClick={() => onSaveHandler(INPUTS.privacyPolicy)}
							width={28}
							height={28}
						/>
					)}
					{isLoadingPrivacyPolicy && <Loading className={styles.loader} />}
				</div>
			</div>

			<div>
				<p className={styles.blockName}>Версия приложения</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.appVersion].value}
						onChange={e => onChangeHandler(INPUTS.appVersion, e)}
					/>
					{inputData[INPUTS.appVersion].change && (
						<DoneIcon
							onClick={() => onSaveHandler(INPUTS.appVersion)}
							width={28}
							height={28}
						/>
					)}
					{isLoadingAppVersion && <Loading className={styles.loader} />}
				</div>
			</div>

			<div>
				<p className={styles.nameApp}>Блок developer:</p>
				<p className={styles.nameApp}>Иконка гугл плей</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.googlePlayIcon].value}
						onChange={e => onChangeHandler(INPUTS.googlePlayIcon, e)}
					/>
					{inputData[INPUTS.googlePlayIcon].change && (
						<DoneIcon
							onClick={() => onSaveHandler(INPUTS.googlePlayIcon)}
							width={28}
							height={28}
						/>
					)}
					{isLoadingChangeGooglePlay && <Loading className={styles.loader} />}
				</div>

				<p className={styles.nameApp}>Ссылка на гугл плей</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.googlePlayLink].value}
						onChange={e => onChangeHandler(INPUTS.googlePlayLink, e)}
					/>
					{inputData[INPUTS.googlePlayLink].change && (
						<DoneIcon
							onClick={() => onSaveHandler(INPUTS.googlePlayLink)}
							width={28}
							height={28}
						/>
					)}
					{isLoadingChangeGooglePlay && <Loading className={styles.loader} />}
				</div>
			</div>
		</div>
	)
}

export default InputsApp
