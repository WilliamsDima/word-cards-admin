import React from "react"
import styles from "./MainPage.module.scss"

function MainPage() {
	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<div className={styles.header}>
					<h1 className={styles.title}>Admin overview</h1>
					<p className={styles.subtitle}>
						Quick entry point for product resources and store links.
					</p>
				</div>
				<a
					href='https://play.google.com/store/apps/details?id=com.williamsdev.wordcards'
					target='_blank'
					className={styles.link}
				>
					{/* <GooglePlay /> */}
					приложение
				</a>
			</div>
		</div>
	)
}

export default MainPage
