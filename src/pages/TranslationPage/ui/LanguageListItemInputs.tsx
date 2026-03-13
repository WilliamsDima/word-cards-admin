import React, { memo, useCallback, useMemo } from "react"
import styles from "../TranslationPage.module.scss"
import Input from "@shared/Input/Input"
import type { LanguageItem } from "@shared/api/services/languages/types"

type Props = {
	localName: string
	localEmoji: string
	language: LanguageItem
	setLocalName: React.Dispatch<React.SetStateAction<string>>
	setLocalEmoji: React.Dispatch<React.SetStateAction<string>>
}

const LanguageListItemInputs: React.FC<Props> = memo(
	({ localEmoji, localName, language, setLocalEmoji, setLocalName }) => {
		const namePlaceholder = useMemo(() => language.name, [language.name])
		const emojiPlaceholder = useMemo(() => language.emoji, [language.emoji])

		const onChangeName = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setLocalName(e.target.value),
			[],
		)

		const onChangeEmoji = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => setLocalEmoji(e.target.value),
			[],
		)

		return (
			<div className={styles.metaEdit}>
				<label className={styles.field}>
					<span className={styles.label}>Название</span>
					<Input
						value={localName}
						onChange={onChangeName}
						placeholder={namePlaceholder}
					/>
				</label>
				<label className={styles.field}>
					<span className={styles.label}>Emoji</span>
					<Input
						value={localEmoji}
						onChange={onChangeEmoji}
						placeholder={emojiPlaceholder}
					/>
				</label>
				<div className={styles.codeField}>
					<span className={styles.label}>Код языка</span>
					<div className={styles.codeValue}>{language.code.toUpperCase()}</div>
				</div>
			</div>
		)
	},
)

export default LanguageListItemInputs
