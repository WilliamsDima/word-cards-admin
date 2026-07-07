import React, { memo, useCallback, useMemo } from "react"
import cn from "classnames"
import styles from "./YearInReview.module.scss"

type Props = {
	code: string
	name: string
	active: boolean
	filled: boolean
	onSelect: (code: string) => void
}

const YearInReviewLanguageTab: React.FC<Props> = memo(
	({ code, name, active, filled, onSelect }) => {
		const tabClassName = useMemo(
			() =>
				cn(styles.languageTab, {
					[styles.languageTabActive]: active,
					[styles.languageTabFilled]: filled,
				}),
			[active, filled],
		)

		const onClickHandler = useCallback(() => onSelect(code), [code, onSelect])

		return (
			<button type='button' className={tabClassName} onClick={onClickHandler}>
				{name} ({code})
			</button>
		)
	},
)

export default YearInReviewLanguageTab
