import React, { memo, useCallback } from "react"
import styles from "./UserProfileCards.module.scss"
import Input from "@shared/Input/Input"
import { Icon } from "@assets/icons/Icon"

export type EditableCardItem = {
	key: string
	word: string
	translate: string
}

type Props = {
	item: EditableCardItem
	onChange: (key: string, field: "word" | "translate", value: string) => void
	onRemove: (key: string) => void
	isDisabled: boolean
}

const UserProfileCardItemRow: React.FC<Props> = ({
	item,
	onChange,
	onRemove,
	isDisabled,
}) => {
	const onWordChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onChange(item.key, "word", event.target.value)
		},
		[item.key, onChange],
	)

	const onTranslateChange = useCallback(
		(event: React.ChangeEvent<HTMLInputElement>) => {
			onChange(item.key, "translate", event.target.value)
		},
		[item.key, onChange],
	)

	const onRemoveClick = useCallback(() => {
		onRemove(item.key)
	}, [item.key, onRemove])

	return (
		<div className={styles.editorRow}>
			<Input
				placeholder='Слово'
				value={item.word}
				onChange={onWordChange}
				disabled={isDisabled}
			/>
			<Input
				placeholder='Перевод'
				value={item.translate}
				onChange={onTranslateChange}
				disabled={isDisabled}
			/>
			<button
				type='button'
				className={styles.removeBtn}
				onClick={onRemoveClick}
				disabled={isDisabled}
			>
				<Icon kind='svg' name='delete-red-64' width={20} height={20} />
			</button>
		</div>
	)
}

export default memo(UserProfileCardItemRow)
