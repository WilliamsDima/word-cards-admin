import React from "react"
import styles from "./AppPreloader.module.scss"

const AppPreloader = () => {
	return (
		<div className={styles.backdrop} role='status' aria-live='polite'>
			<div className={styles.panel}>
				<div className={styles.loader}>
					<div className={styles.ring} />
					<div className={styles.orbit}>
						<span className={styles.dot} />
					</div>
					<div className={`${styles.orbit} ${styles.orbitTwo}`}>
						<span className={`${styles.dot} ${styles.dotAlt}`} />
					</div>
					<div className={`${styles.orbit} ${styles.orbitThree}`}>
						<span className={`${styles.dot} ${styles.dotWarm}`} />
					</div>
					<div className={styles.core} />
				</div>
				<h2 className={styles.title}>
					{"\u0417\u0430\u0433\u0440\u0443\u0437\u043a\u0430"}
				</h2>
				<p className={styles.subtitle}>
					{"\u041f\u0440\u043e\u0432\u0435\u0440\u044f\u0435\u043c \u043f\u0440\u0430\u0432\u0430 \u0434\u043e\u0441\u0442\u0443\u043f\u0430 \u0438 \u043f\u043e\u0434\u0433\u043e\u0442\u0430\u0432\u043b\u0438\u0432\u0430\u0435\u043c \u0438\u043d\u0442\u0435\u0440\u0444\u0435\u0439\u0441"}
				</p>
			</div>
		</div>
	)
}

export default AppPreloader
