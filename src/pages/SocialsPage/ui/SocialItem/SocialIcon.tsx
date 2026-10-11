import React, { memo, useCallback, useMemo, useState } from "react"
import styles from "./SocialItem.module.scss"

type Props = {
	src: string
	name: string
}

/** Иконка соцсети в заголовке; если ссылка пустая или не грузится — первая буква названия */
const SocialIcon: React.FC<Props> = memo(({ src, name }) => {
	const [failedSrc, setFailedSrc] = useState<string | null>(null)

	const trimmedSrc = useMemo(() => src.trim(), [src])
	const isImageVisible = useMemo(
		() => trimmedSrc.length > 0 && failedSrc !== trimmedSrc,
		[failedSrc, trimmedSrc],
	)
	const fallbackLabel = useMemo(
		() => name.trim().charAt(0).toUpperCase() || "?",
		[name],
	)

	const onError = useCallback(() => setFailedSrc(trimmedSrc), [trimmedSrc])

	return isImageVisible ? (
		<img
			className={styles.socialIcon}
			src={trimmedSrc}
			alt={name}
			loading='lazy'
			onError={onError}
		/>
	) : (
		<span className={styles.socialIconFallback}>{fallbackLabel}</span>
	)
})

export default SocialIcon
