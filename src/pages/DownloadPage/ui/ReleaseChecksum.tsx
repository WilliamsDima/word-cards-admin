import { type FC, memo, useCallback } from "react"
import { useToast } from "@shared/Toast/useToast"
import styles from "../DownloadPage.module.scss"

type Props = {
	sha256: string
}

const ReleaseChecksum: FC<Props> = memo(({ sha256 }) => {
	const toast = useToast()

	const handleCopy = useCallback(async () => {
		try {
			await navigator.clipboard.writeText(sha256)
			toast.success("SHA-256 скопирован")
		} catch {
			toast.error("Не удалось скопировать", "Выделите строку и скопируйте вручную")
		}
	}, [sha256, toast])

	return (
		<div className={styles.checksum}>
			<p className={styles.checksumLabel}>Контрольная сумма SHA-256</p>
			<div className={styles.checksumRow}>
				<code className={styles.checksumValue}>{sha256}</code>
				<button type='button' className={styles.copyBtn} onClick={handleCopy}>
					Копировать
				</button>
			</div>
		</div>
	)
})

export default ReleaseChecksum
