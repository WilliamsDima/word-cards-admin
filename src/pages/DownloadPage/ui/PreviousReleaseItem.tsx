import { type FC, memo, useMemo } from "react"
import styles from "../DownloadPage.module.scss"
import {
	formatReleaseDate,
	formatReleaseSize,
	formatReleaseVersion,
} from "../model/format"
import type { ListedRelease } from "../model/types"
import ReleaseChangelog from "./ReleaseChangelog"

type Props = {
	release: ListedRelease
}

const META_SEPARATOR = " · "

const PreviousReleaseItem: FC<Props> = memo(({ release }) => {
	const versionLabel = useMemo(
		() => formatReleaseVersion(release.versionName, release.versionCode),
		[release.versionName, release.versionCode],
	)

	const metaLabel = useMemo(
		() =>
			[formatReleaseDate(release.publishedAt), formatReleaseSize(release.size)]
				.filter(Boolean)
				.join(META_SEPARATOR),
		[release.publishedAt, release.size],
	)

	const downloadLabel = useMemo(
		() => `Скачать версию ${release.versionName}`,
		[release.versionName],
	)

	return (
		<li className={styles.previousItem}>
			<div className={styles.previousHeader}>
				<div className={styles.previousInfo}>
					<p className={styles.previousVersion}>{versionLabel}</p>
					{metaLabel ? <p className={styles.previousMeta}>{metaLabel}</p> : <></>}
				</div>
				<a
					className={styles.previousLink}
					href={release.url}
					download={release.fileName}
					aria-label={downloadLabel}
				>
					Скачать
				</a>
			</div>
			<ReleaseChangelog changelog={release.changelog} />
		</li>
	)
})

export default PreviousReleaseItem
