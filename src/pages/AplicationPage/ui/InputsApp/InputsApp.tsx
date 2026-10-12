import Input from "@shared/Input/Input"
import React, { useMemo } from "react"
import styles from "./InputsApp.module.scss"
import Loading from "@shared/Loading/Loading"
import { INPUTS, useInputsApp } from "./useInputsApp"
import { Icon } from "@assets/icons/Icon"

const RECOMMENDED_DOWNLOAD_LINK = "https://wordcards-admin.duckdns.org/download"

const InputsApp = () => {
	const { inputData, onChangeHandler, onSaveHandler, isSaving, savingKey } =
		useInputsApp()

	const savingFlags = useMemo(
		() => ({
			appName: isSaving && savingKey === INPUTS.appName,
			privacyPolicy: isSaving && savingKey === INPUTS.privacyPolicy,
			appVersion: isSaving && savingKey === INPUTS.appVersion,
			developerIcon: isSaving && savingKey === INPUTS.developerIcon,
			developerLink: isSaving && savingKey === INPUTS.developerLink,
		}),
		[isSaving, savingKey],
	)

	const saveVisible = useMemo(
		() => ({
			developerIcon:
				inputData[INPUTS.developerIcon].change && !savingFlags.developerIcon,
			developerLink:
				inputData[INPUTS.developerLink].change && !savingFlags.developerLink,
		}),
		[inputData, savingFlags],
	)

	const changeHandlers = useMemo(
		() => ({
			appName: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.appName, e),
			privacyPolicy: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.privacyPolicy, e),
			appVersion: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.appVersion, e),
			developerIcon: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.developerIcon, e),
			developerLink: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.developerLink, e),
		}),
		[onChangeHandler],
	)

	const saveHandlers = useMemo(
		() => ({
			appName: () => onSaveHandler(INPUTS.appName),
			privacyPolicy: () => onSaveHandler(INPUTS.privacyPolicy),
			appVersion: () => onSaveHandler(INPUTS.appVersion),
			developerIcon: () => onSaveHandler(INPUTS.developerIcon),
			developerLink: () => onSaveHandler(INPUTS.developerLink),
		}),
		[onSaveHandler],
	)

	return (
		<div className={styles.inputs}>
			<div className={styles.group}>
				<p className={styles.label}>Название приложения</p>

				<div className={styles.inputWrapper}>
					<Input
						value={inputData[INPUTS.appName].value}
						onChange={changeHandlers.appName}
					/>
					{inputData[INPUTS.appName].change && !savingFlags.appName && (
						<Icon
							kind='svg'
							name='done-green-48'
							onClick={saveHandlers.appName}
							width={28}
							height={28}
						/>
					)}
					{savingFlags.appName && <Loading className={styles.loader} />}
				</div>
			</div>

			<div className={styles.group}>
				<p className={styles.label}>Политика конфиденциальности</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.privacyPolicy].value}
						onChange={changeHandlers.privacyPolicy}
					/>
					{inputData[INPUTS.privacyPolicy].change &&
						!savingFlags.privacyPolicy && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={saveHandlers.privacyPolicy}
								width={28}
								height={28}
							/>
						)}
					{savingFlags.privacyPolicy && <Loading className={styles.loader} />}
				</div>
			</div>

			<div className={styles.group}>
				<p className={styles.label}>Версия приложения</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.appVersion].value}
						onChange={changeHandlers.appVersion}
					/>
					{inputData[INPUTS.appVersion].change && !savingFlags.appVersion && (
						<Icon
							kind='svg'
							name='done-green-48'
							onClick={saveHandlers.appVersion}
							width={28}
							height={28}
						/>
					)}
					{savingFlags.appVersion && <Loading className={styles.loader} />}
				</div>
			</div>

			<p className={styles.subtitle}>О разработчике:</p>

			<div className={styles.group}>
				<div className={styles.subGroup}>
					<p className={styles.label}>Иконка</p>
					<div className={styles.inputWrapper}>
						<Input
							type='link'
							value={inputData[INPUTS.developerIcon].value}
							onChange={changeHandlers.developerIcon}
						/>
						{saveVisible.developerIcon ? (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={saveHandlers.developerIcon}
								width={28}
								height={28}
							/>
						) : (
							<></>
						)}
						{savingFlags.developerIcon ? (
							<Loading className={styles.loader} />
						) : (
							<></>
						)}
					</div>
				</div>

				<div className={styles.subGroup}>
					<p className={styles.label}>Ссылка на скачивание приложения (APK)</p>
					<div className={styles.inputWrapper}>
						<Input
							type='link'
							value={inputData[INPUTS.developerLink].value}
							onChange={changeHandlers.developerLink}
						/>
						{saveVisible.developerLink ? (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={saveHandlers.developerLink}
								width={28}
								height={28}
							/>
						) : (
							<></>
						)}
						{savingFlags.developerLink ? (
							<Loading className={styles.loader} />
						) : (
							<></>
						)}
					</div>
					<p className={styles.hint}>
						Рекомендуется: {RECOMMENDED_DOWNLOAD_LINK} — публичная страница
						скачивания APK.
					</p>
				</div>
			</div>
		</div>
	)
}

export default InputsApp
