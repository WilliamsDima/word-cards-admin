import { type FC, memo, useMemo } from "react"
import { dateService } from "@shared/lib/date"
import styles from "../DownloadPage.module.scss"
import type { LatestRelease } from "../model/types"
import DownloadButton from "./DownloadButton"
import ReleaseChangelog from "./ReleaseChangelog"
import ReleaseChecksum from "./ReleaseChecksum"

type Props = {
	release: LatestRelease
}

const BYTES_IN_MB = 1024 * 1024
const DATE_FORMAT: Intl.DateTimeFormatOptions = { dateStyle: "long" }
const SIZE_FORMAT: Intl.NumberFormatOptions = { maximumFractionDigits: 1 }

const ReleaseDetails: FC<Props> = memo(({ release }) => {
	const versionLabel = useMemo(
		() =>
			release.versionCode === null
				? release.versionName
				: `${release.versionName} (${release.versionCode})`,
		[release.versionName, release.versionCode],
	)

	const dateLabel = useMemo(
		() =>
			release.publishedAt
				? dateService.format(release.publishedAt, DATE_FORMAT)
				: null,
		[release.publishedAt],
	)

	const sizeLabel = useMemo(
		() =>
			release.size === null || release.size <= 0
				? null
				: `${(release.size / BYTES_IN_MB).toLocaleString("ru-RU", SIZE_FORMAT)} МБ`,
		[release.size],
	)

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
