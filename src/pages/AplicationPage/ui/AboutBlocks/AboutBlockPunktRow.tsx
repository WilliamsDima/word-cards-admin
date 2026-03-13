import React, { memo, useCallback, useMemo } from "react"
import styles from "./AboutBlockItem.module.scss"
import Input from "@shared/Input/Input"
import Button from "@shared/Button/Button"

type Props = {
	blockId: number
	index: number
	value: string
	onChangePunkt: (id: number, index: number, value: string) => void
	onRemovePunkt: (id: number, index: number) => void
}

const AboutBlockPunktRow: React.FC<Props> = memo(
	({ blockId, index, value, onChangePunkt, onRemovePunkt }) => {
		const inputValue = useMemo(() => value, [value])
		const onChangeHandler = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) =>
				onChangePunkt(blockId, index, e.target.value),
			[blockId, index, onChangePunkt],
		)

		const onRemoveHandler = useCallback(
			() => onRemovePunkt(blockId, index),
			[blockId, index, onRemovePunkt],
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
