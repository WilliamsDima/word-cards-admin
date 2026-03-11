import React from "react"
import styles from "./NotFoundPage.module.scss"

function NotFoundPage() {
	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>404</h1>
				<p className={styles.subtitle}>The page was not found.</p>
			</div>
		</div>
	)
}

export default NotFoundPage
