import { type FC, memo, useMemo } from "react"
import styles from "../DownloadPage.module.scss"
import { parseReleaseChangelog } from "../model/changelog"

type Props = {
	changelog: string
}

const ReleaseChangelog: FC<Props> = memo(({ changelog }) => {
	const parsed = useMemo(() => parseReleaseChangelog(changelog), [changelog])

	if (parsed.kind === "empty") return <></>

	return (
		<div className={styles.changelog}>
			<p className={styles.blockTitle}>Что нового</p>
			{parsed.kind === "list" ? (
				<ul className={styles.changelogList}>
					{parsed.items.map((item, index) => (
						<li key={index} className={styles.changelogItem}>
							{item}
						</li>
					))}
				</ul>
			) : (
				<p className={styles.changelogText}>{parsed.text}</p>
			)}
		</div>
	)
})

export default ReleaseChangelog
