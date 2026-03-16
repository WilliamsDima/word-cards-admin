import React, { memo, useCallback, useMemo } from "react"
import styles from "./AboutBlockItem.module.scss"
import Input from "@shared/Input/Input"
import Button from "@shared/Button/Button"

type Props = {
	index: number
	value: string
	onChangePunkt: (index: number, value: string) => void
	onRemovePunkt: (index: number) => void
}

const AboutBlockPunktRow: React.FC<Props> = memo(
	({ index, value, onChangePunkt, onRemovePunkt }) => {
		const inputValue = useMemo(() => value, [value])
		const onChangeHandler = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) =>
				onChangePunkt(index, e.target.value),
			[index, onChangePunkt],
		)

		const onRemoveHandler = useCallback(
			() => onRemovePunkt(index),
			[index, onRemovePunkt],
		)

		return (
			<div className={styles.punktRow}>
				<Input value={inputValue} onChange={onChangeHandler} />
				<Button className={styles.punktRemoveBtn} onClick={onRemoveHandler}>
					Удалить
				</Button>
			</div>
		)
	},
)

export default AboutBlockPunktRow
