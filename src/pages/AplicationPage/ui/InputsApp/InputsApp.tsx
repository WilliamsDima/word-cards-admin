import Input from "@shared/Input/Input"
import React, { useMemo } from "react"
import styles from "./InputsApp.module.scss"
import Loading from "@shared/Loading/Loading"
import { INPUTS, useInputsApp } from "./useInputsApp"
import { Icon } from "@assets/icons/Icon"

const InputsApp = () => {
	const { inputData, onChangeHandler, onSaveHandler, isSaving, savingKey } =
		useInputsApp()

	const savingFlags = useMemo(
		() => ({
			appName: isSaving && savingKey === INPUTS.appName,
			privacyPolicy: isSaving && savingKey === INPUTS.privacyPolicy,
			appVersion: isSaving && savingKey === INPUTS.appVersion,
			googlePlayIcon: isSaving && savingKey === INPUTS.googlePlayIcon,
			googlePlayLink: isSaving && savingKey === INPUTS.googlePlayLink,
		}),
		[isSaving, savingKey],
	)

	const changeHandlers = useMemo(
		() => ({
			appName: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.appName, e),
			privacyPolicy: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.privacyPolicy, e),
			appVersion: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.appVersion, e),
			googlePlayIcon: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.googlePlayIcon, e),
			googlePlayLink: (e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeHandler(INPUTS.googlePlayLink, e),
		}),
		[onChangeHandler],
	)

	const saveHandlers = useMemo(
		() => ({
			appName: () => onSaveHandler(INPUTS.appName),
			privacyPolicy: () => onSaveHandler(INPUTS.privacyPolicy),
			appVersion: () => onSaveHandler(INPUTS.appVersion),
			googlePlayIcon: () => onSaveHandler(INPUTS.googlePlayIcon),
			googlePlayLink: () => onSaveHandler(INPUTS.googlePlayLink),
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
					<p className={styles.label}>Иконка гугл плей</p>
					<div className={styles.inputWrapper}>
						<Input
							type='link'
							value={inputData[INPUTS.googlePlayIcon].value}
							onChange={changeHandlers.googlePlayIcon}
						/>
						{inputData[INPUTS.googlePlayIcon].change &&
							!savingFlags.googlePlayIcon && (
								<Icon
									kind='svg'
									name='done-green-48'
									onClick={saveHandlers.googlePlayIcon}
									width={28}
									height={28}
								/>
							)}
						{savingFlags.googlePlayIcon && (
							<Loading className={styles.loader} />
						)}
					</div>
				</div>

				<div className={styles.subGroup}>
					<p className={styles.label}>Ссылка на гугл плей</p>
					<div className={styles.inputWrapper}>
						<Input
							type='link'
							value={inputData[INPUTS.googlePlayLink].value}
							onChange={changeHandlers.googlePlayLink}
						/>
						{inputData[INPUTS.googlePlayLink].change &&
							!savingFlags.googlePlayLink && (
								<Icon
									kind='svg'
									name='done-green-48'
									onClick={saveHandlers.googlePlayLink}
									width={28}
									height={28}
								/>
							)}
						{savingFlags.googlePlayLink && (
							<Loading className={styles.loader} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default InputsApp
