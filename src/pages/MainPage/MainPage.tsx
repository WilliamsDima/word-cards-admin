import React from "react"
import styles from "./MainPage.module.scss"
import PageHeader from "@shared/PageHeader/PageHeader"

function MainPage() {
	return (
		<div className={styles.page}>
			<div className={styles.card}>
				<PageHeader
					title='Admin overview'
					subtitle='Quick entry point for product resources and store links.'
				/>
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
