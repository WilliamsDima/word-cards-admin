import { type FC, memo } from "react"
import styles from "../DownloadPage.module.scss"
import { usePreviousReleases } from "../model/usePreviousReleases"
import PreviousReleaseItem from "./PreviousReleaseItem"

type Props = {
	latestVersionCode: number | null
}

const PreviousReleases: FC<Props> = memo(({ latestVersionCode }) => {
	const releases = usePreviousReleases(latestVersionCode)

	if (releases.length === 0) return <></>

	return (
		<section className={styles.previous}>
			<h2 className={styles.blockTitle}>Предыдущие версии</h2>
			<p className={styles.previousNote}>
				Пригодятся, если в актуальной версии что-то не работает.
			</p>
			<p className={styles.previousWarning}>
				Android не установит старую версию поверх новой: сначала удалите текущее
				приложение. Карточки хранятся на сервере — после установки снова войдите в
				аккаунт, и всё вернётся.
			</p>
			<ul className={styles.previousList}>
				{releases.map((release) => (
					<PreviousReleaseItem key={release.url} release={release} />
				))}
			</ul>
		</section>
	)
})

export default PreviousReleases
