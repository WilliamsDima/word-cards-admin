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
			<span className={skeletonClassName} style={style} />
		)
	},
)

export default Skeleton
