import { type FC, memo, useMemo } from "react"
import styles from "../DownloadPage.module.scss"
import {
	formatReleaseDate,
	formatReleaseSize,
	formatReleaseVersion,
} from "../model/format"
import type { LatestRelease } from "../model/types"
import DownloadButton from "./DownloadButton"
import ReleaseChangelog from "./ReleaseChangelog"
import ReleaseChecksum from "./ReleaseChecksum"

type Props = {
	release: LatestRelease
}

const ReleaseDetails: FC<Props> = memo(({ release }) => {
	const versionLabel = useMemo(
		() => formatReleaseVersion(release.versionName, release.versionCode),
		[release.versionName, release.versionCode],
	)

	const dateLabel = useMemo(
		() => formatReleaseDate(release.publishedAt),
		[release.publishedAt],
	)

	const sizeLabel = useMemo(() => formatReleaseSize(release.size), [release.size])

	const hasChecksum = useMemo(() => release.sha256.length > 0, [release.sha256])

	return (
		<div className={styles.release}>
			<dl className={styles.meta}>
				<div className={styles.metaItem}>
					<dt className={styles.metaLabel}>Версия</dt>
					<dd className={styles.metaValue}>{versionLabel}</dd>
				</div>
				{dateLabel ? (
					<div className={styles.metaItem}>
						<dt className={styles.metaLabel}>Опубликована</dt>
						<dd className={styles.metaValue}>{dateLabel}</dd>
					</div>
				) : (
					<></>
				)}
				{sizeLabel ? (
					<div className={styles.metaItem}>
						<dt className={styles.metaLabel}>Размер</dt>
						<dd className={styles.metaValue}>{sizeLabel}</dd>
					</div>
				) : (
					<></>
				)}
			</dl>

			<DownloadButton href={release.url} fileName={release.fileName} />

			<ReleaseChangelog changelog={release.changelog} />

			{hasChecksum ? <ReleaseChecksum sha256={release.sha256} /> : <></>}
		</div>
	)
})

export default ReleaseDetails
