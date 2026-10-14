import { type FC, memo } from "react"
import cn from "classnames"
import styles from "./UserProfileNotifications.module.scss"
import type { PushSendResult } from "../lib/pushNotificationForm"

type Props = {
	result: PushSendResult
}

const UserProfilePushResult: FC<Props> = memo(({ result }) => (
	<div
		className={cn(styles.pushResult, {
			[styles.pushResultSuccess]: result.kind === "success",
			[styles.pushResultPartial]: result.kind === "partial",
			[styles.pushResultError]: result.kind === "error",
		})}
		role={result.kind === "error" ? "alert" : "status"}
	>
		<div className={styles.pushResultTitle}>{result.title}</div>
		<div className={styles.pushResultMessage}>{result.message}</div>
	</div>
))

export default UserProfilePushResult
