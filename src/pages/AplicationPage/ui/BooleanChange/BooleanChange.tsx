import React, { useCallback, useEffect, useState } from "react"
import styles from "./BooleanChange.module.scss"
import { useAppSelector } from "@shared/hooks/useStore"
import { useChangeShowVkAuthMutation } from "../../api/AppServices"
import Select, { type SingleValue } from "react-select"
import DoneIcon from "@assets/icons/done-green-48.svg?react"

type OptionVk = {
	value: boolean
	label: string
}

const optionsVk: OptionVk[] = [
	{ value: true, label: "true" },
	{ value: false, label: "false" },
]

function BooleanChange() {
	const { firebaseApp } = useAppSelector(store => store.app)

	const [showVKAuth, setShowVKAuth] = useState<
		SingleValue<OptionVk> | undefined
	>()

	const [changeShowVkAuth, { isLoading }] = useChangeShowVkAuthMutation()

	const onChangeVk = (newValue: any) => {
		setShowVKAuth(newValue)
	}

	const save = useCallback(() => {
		if (showVKAuth) changeShowVkAuth({ showVKAuth: showVKAuth?.value })
	}, [showVKAuth, changeShowVkAuth])

	useEffect(() => {
		if (firebaseApp?.showVKAuth !== undefined)
			setShowVKAuth(optionsVk.find(it => it.value === firebaseApp?.showVKAuth))
	}, [firebaseApp])

	return (
		<div>
			<div>
				<p className={styles.nameApp}>Авторизация через VK</p>

				<div className={styles.inputWrapper}>
					<Select
						isLoading={isLoading}
						options={optionsVk}
						value={showVKAuth}
						styles={{
							option: (s, { isSelected }) => ({
								...s,
								color: isSelected ? "#1fb141" : "#000",
								backgroundColor: "#fff",
								padding: 10,
							}),
							control: s => ({
								...s,
								backgroundColor: "#fff",
							}),
							singleValue: s => ({
								...s,
								color: "#1fb141",
							}),
						}}
						onChange={onChangeVk}
					/>
					{firebaseApp?.showVKAuth !== undefined &&
						firebaseApp?.showVKAuth !== showVKAuth?.value &&
						!isLoading && <DoneIcon onClick={save} width={28} height={28} />}
				</div>
			</div>
		</div>
	)
}

export default BooleanChange
