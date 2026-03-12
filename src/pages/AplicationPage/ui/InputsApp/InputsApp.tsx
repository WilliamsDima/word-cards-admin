import Input from "@shared/Input/Input"
import React from "react"
import styles from "./InputsApp.module.scss"
import Loading from "@shared/Loading/Loading"
import { INPUTS, useInputsApp } from "./useInputsApp"
import { Icon } from "@assets/icons/Icon"

const InputsApp = () => {
	const { inputData, onChangeHandler, onSaveHandler, isSaving, savingKey } =
		useInputsApp()

	const isSavingField = (key: keyof typeof INPUTS) =>
		isSaving && savingKey === key

	return (
		<div className={styles.inputs}>
			<div className={styles.group}>
				<p className={styles.label}>Название приложения</p>

				<div className={styles.inputWrapper}>
					<Input
						value={inputData[INPUTS.appName].value}
						onChange={e => onChangeHandler(INPUTS.appName, e)}
					/>
					{inputData[INPUTS.appName].change &&
						!isSavingField(INPUTS.appName) && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={() => onSaveHandler(INPUTS.appName)}
								width={28}
								height={28}
							/>
						)}
					{isSavingField(INPUTS.appName) && (
						<Loading className={styles.loader} />
					)}
				</div>
			</div>

			<div className={styles.group}>
				<p className={styles.label}>Политика конфиденциальности</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.privacyPolicy].value}
						onChange={e => onChangeHandler(INPUTS.privacyPolicy, e)}
					/>
					{inputData[INPUTS.privacyPolicy].change &&
						!isSavingField(INPUTS.privacyPolicy) && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={() => onSaveHandler(INPUTS.privacyPolicy)}
								width={28}
								height={28}
							/>
						)}
					{isSavingField(INPUTS.privacyPolicy) && (
						<Loading className={styles.loader} />
					)}
				</div>
			</div>

			<div className={styles.group}>
				<p className={styles.label}>Версия приложения</p>

				<div className={styles.inputWrapper}>
					<Input
						type='link'
						value={inputData[INPUTS.appVersion].value}
						onChange={e => onChangeHandler(INPUTS.appVersion, e)}
					/>
					{inputData[INPUTS.appVersion].change &&
						!isSavingField(INPUTS.appVersion) && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={() => onSaveHandler(INPUTS.appVersion)}
								width={28}
								height={28}
							/>
						)}
					{isSavingField(INPUTS.appVersion) && (
						<Loading className={styles.loader} />
					)}
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
							onChange={e => onChangeHandler(INPUTS.googlePlayIcon, e)}
						/>
						{inputData[INPUTS.googlePlayIcon].change &&
							!isSavingField(INPUTS.googlePlayIcon) && (
								<Icon
									kind='svg'
									name='done-green-48'
									onClick={() => onSaveHandler(INPUTS.googlePlayIcon)}
									width={28}
									height={28}
								/>
							)}
						{isSavingField(INPUTS.googlePlayIcon) && (
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
							onChange={e => onChangeHandler(INPUTS.googlePlayLink, e)}
						/>
						{inputData[INPUTS.googlePlayLink].change &&
							!isSavingField(INPUTS.googlePlayLink) && (
								<Icon
									kind='svg'
									name='done-green-48'
									onClick={() => onSaveHandler(INPUTS.googlePlayLink)}
									width={28}
									height={28}
								/>
							)}
						{isSavingField(INPUTS.googlePlayLink) && (
							<Loading className={styles.loader} />
						)}
					</div>
				</div>
			</div>
		</div>
	)
}

export default InputsApp
