import React from "react"
import styles from "./NotFoundPage.module.scss"
import Card from "@shared/Card/Card"

function NotFoundPage() {
	return (
		<div className={styles.page}>
			<Card className={styles.card}>
				<h1 className={styles.title}>404</h1>
				<p className={styles.subtitle}>The page was not found.</p>
			</Card>
		</div>
	)
}

export default NotFoundPage
