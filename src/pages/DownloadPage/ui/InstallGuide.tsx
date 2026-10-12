import { memo } from "react"
import styles from "../DownloadPage.module.scss"

const InstallGuide = memo(() => {
	return (
		<section className={styles.guide}>
			<h2 className={styles.blockTitle}>Как установить</h2>
			<ol className={styles.steps}>
				<li>
					Нажмите «Скачать APK» и дождитесь окончания загрузки.
				</li>
				<li>
					Откройте скачанный файл. Если Android попросит, разрешите браузеру
					(или файловому менеджеру) установку из неизвестных источников.
				</li>
				<li>
					Если раньше вы ставили Word Cards из Google Play, сначала удалите
					эту версию: у неё другая подпись, и поверх неё новая не установится.
				</li>
				<li>
					Ваши карточки и прогресс хранятся на сервере — после входа в тот же
					аккаунт всё вернётся.
				</li>
			</ol>
		</section>
	)
})

export default InstallGuide
