import React, { memo, useMemo } from "react"
import cn from "classnames"
import Button from "@shared/Button/Button"
import styles from "../TranslationPage.module.scss"

type Props = {
	onApply: () => void
	onCancel: () => void
}

/**
 * Закреплённая над JSON-редактором панель: дублирует кнопки
 * «применить/отменить» редактора, которые могут оказаться внизу скролла.
 */
const LanguageJsonEditToolbar: React.FC<Props> = memo(({ onApply, onCancel }) => {
	const applyClassName = useMemo(() => cn(styles.primaryBtn, styles.smallBtn), [])
	const cancelClassName = useMemo(() => cn(styles.ghostBtn, styles.smallBtn), [])

	return (
		<div className={styles.jsonToolbar}>
			<span className={styles.jsonToolbarText}>
				JSON редактируется — примените или отмените правку, чтобы сохранить язык
			</span>
			<div className={styles.jsonToolbarActions}>
				<Button className={applyClassName} onClick={onApply}>
					Применить JSON
				</Button>
				<Button className={cancelClassName} onClick={onCancel}>
					Отменить правку
				</Button>
			</div>
		</div>
	)
})

export default LanguageJsonEditToolbar
