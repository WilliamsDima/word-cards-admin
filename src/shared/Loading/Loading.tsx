import React, { FC, memo } from "react"
import styles from "./Loading.module.scss"

const Loading: FC = memo(() => {
	return (
		<svg viewBox='25 25 50 50' className={styles.loading}>
			<circle r='20' cy='50' cx='50'></circle>
		</svg>
	)
})

export default Loading
