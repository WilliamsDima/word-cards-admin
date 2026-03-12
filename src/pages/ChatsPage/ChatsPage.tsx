import React from "react"
import styles from "./ChatsPage.module.scss"
import Card from "@shared/Card/Card"

function ChatsPage() {
	return (
		<div className={styles.page}>
			<Card className={styles.card}>
				<h1 className={styles.title}>Support chats</h1>
				<p className={styles.subtitle}>
					Incoming support conversations will appear here.
				</p>
			</Card>
		</div>
	)
}

export default ChatsPage
