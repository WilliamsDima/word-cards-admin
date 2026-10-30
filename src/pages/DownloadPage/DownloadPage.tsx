import { useEffect, useMemo } from "react"
import { Icon } from "@assets/icons/Icon"
import styles from "./DownloadPage.module.scss"
import { useLatestRelease } from "./model/useLatestRelease"
import DownloadContent from "./ui/DownloadContent"
import InstallGuide from "./ui/InstallGuide"
import PreviousReleases from "./ui/PreviousReleases"

const PAGE_TITLE = "Word Cards — скачать для Android"

/**
 * Публичная страница скачивания APK. Работает без входа: не использует
 * защищённый API, только статические /apk/latest.json и /apk/releases.json.
 */
function DownloadPage() {
	const { state, retry } = useLatestRelease()

	const latestVersionCode = useMemo(
		() => (state.status === "ready" ? state.release.versionCode : null),
		[state],
	)

	useEffect(() => {
		const previousTitle = document.title
		document.title = PAGE_TITLE
		return () => {
			document.title = previousTitle
		}
	}, [])

	return (
		<div className={styles.page}>
			<main className={styles.content}>
				<header className={styles.header}>
					<div className={styles.logo}>
						<Icon kind='webp' name='logo' width={72} height={72} alt='Word Cards' />
					</div>
					<div className={styles.headerText}>
						<h1 className={styles.title}>Word Cards</h1>
						<p className={styles.subtitle}>
							Карточки для изучения иностранных слов. Приложение для Android.
						</p>
					</div>
				</header>

				<section className={styles.card}>
					<DownloadContent state={state} onRetry={retry} />
				</section>

				<InstallGuide />

				<PreviousReleases latestVersionCode={latestVersionCode} />
			</main>
		</div>
	)
}

export default DownloadPage
