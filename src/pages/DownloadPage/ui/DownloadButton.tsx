import { type FC, memo, useMemo } from "react"
import styles from "../DownloadPage.module.scss"

type Props = {
	href: string
	fileName?: string
}

const DownloadButton: FC<Props> = memo(({ href, fileName }) => {
	// Пустая строка в `download` означает «имя из URL» — то же, что и без имени.
	const downloadName = useMemo(() => fileName ?? "", [fileName])

	return (
		<a className={styles.downloadBtn} href={href} download={downloadName}>
			Скачать APK
		</a>
	)
})

export default DownloadButton
