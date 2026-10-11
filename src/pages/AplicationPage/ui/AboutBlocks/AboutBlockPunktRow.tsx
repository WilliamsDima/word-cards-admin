import React, { memo, useCallback, useMemo } from "react"
import styles from "./AboutBlockItem.module.scss"
import Input from "@shared/Input/Input"
import Button from "@shared/Button/Button"
import TranslationKeyPreview from "@shared/TranslationKeyPreview/TranslationKeyPreview"
import {
	resolveTranslationPreview,
	type TranslationDictionary,
} from "@shared/lib/translationPreview"

type Props = {
	index: number
	value: string
	translations: TranslationDictionary | null
	onChangePunkt: (index: number, value: string) => void
	onRemovePunkt: (index: number) => void
}

const AboutBlockPunktRow: React.FC<Props> = memo(
	({ index, value, translations, onChangePunkt, onRemovePunkt }) => {
		const inputValue = useMemo(() => value, [value])
		const preview = useMemo(
			() => resolveTranslationPreview(translations, value),
			[translations, value],
		)
		const isKeyMissing = useMemo(
			() => preview?.status === "missing",
			[preview],
		)

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
				<div className={styles.punktField}>
					<Input
						value={inputValue}
						onChange={onChangeHandler}
						isError={isKeyMissing}
					/>
					<TranslationKeyPreview preview={preview} />
				</div>
				<Button className={styles.punktRemoveBtn} onClick={onRemoveHandler}>
					Удалить
				</Button>
			</div>
		)
	},
)

export default AboutBlockPunktRow
