import React from "react"
import styles from "./ChatsPage.module.scss"

function ChatsPage() {
	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<h1 className={styles.title}>Support chats</h1>
				<p className={styles.subtitle}>
					Incoming support conversations will appear here.
				</p>
			</div>
		</div>
	)
}

export default ChatsPage
