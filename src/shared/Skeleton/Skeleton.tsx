import React, { CSSProperties, FC, memo, useMemo } from "react"
import cn from "classnames"
import styles from "./Skeleton.module.scss"

type SkeletonProps = {
	width?: number | string
	height?: number | string
	circle?: boolean
	className?: string
}

const Skeleton: FC<SkeletonProps> = memo(
	({ width, height, circle, className }) => {
		const style = useMemo<CSSProperties>(
			() => ({
				width,
				height,
			}),
			[height, width],
		)

		const skeletonClassName = useMemo(
			() =>
				cn(styles.skeleton, className, {
					[styles.circle]: circle,
				}),
			[className, circle],
		)

		return (
			// eslint-disable-next-line react/forbid-dom-props -- width/height приходят из пропсов динамически, статическим CSS-модулем их не задать
			<span className={skeletonClassName} style={style} />
		)
	},
)

export default Skeleton
