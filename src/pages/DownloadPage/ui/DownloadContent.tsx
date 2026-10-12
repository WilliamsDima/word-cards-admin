import { type FC, memo } from "react"
import Loading from "@shared/Loading/Loading"
import Button from "@shared/Button/Button"
import styles from "../DownloadPage.module.scss"
import type { LatestReleaseState } from "../model/types"
import DownloadButton from "./DownloadButton"
import ReleaseDetails from "./ReleaseDetails"

type Props = {
	state: LatestReleaseState
	onRetry: () => void
}

const DownloadContent: FC<Props> = memo(({ state, onRetry }) => {
	switch (state.status) {
		case "loading":
			return (
				<div className={styles.status}>
					<Loading className={styles.loader} />
					<p className={styles.statusText}>Загружаем информацию о версии…</p>
				</div>
			)

		case "empty":
			return (
				<div className={styles.status}>
					<p className={styles.statusTitle}>Релизов пока нет</p>
					<p className={styles.statusText}>
						Приложение ещё не опубликовано. Загляните сюда чуть позже.
					</p>
				</div>
			)

		case "error":
			return (
				<div className={styles.status}>
					<p className={styles.statusTitle}>Не удалось загрузить данные</p>
					<p className={styles.statusText}>{state.message}</p>
					<Button className={styles.retryBtn} onClick={onRetry}>
						Повторить
					</Button>
				</div>
			)

		case "fallback":
			return (
				<div className={styles.status}>
					<p className={styles.statusText}>
						Подробности о версии недоступны, но последнюю версию можно скачать.
					</p>
					<DownloadButton href={state.downloadUrl} />
				</div>
			)

		case "ready":
			return <ReleaseDetails release={state.release} />

		default:
			return <></>
	}
})

export default DownloadContent
