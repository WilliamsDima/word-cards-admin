import React from "react"
import styles from "./MainPage.module.scss"

function MainPage() {
	return (
		<div>
			<a
				href='https://play.google.com/store/apps/details?id=com.williamsdev.wordcards'
				target='_blank'
				className={styles.link}
			>
				<GooglePlay />
				приложение
			</a>
		</div>
	)
}

export default MainPage
