import React, { CSSProperties, FC, memo } from "react"
import cn from "classnames"
import styles from "./Skeleton.module.scss"

type SkeletonProps = {
	width?: number | string
	height?: number | string
	circle?: boolean
	className?: string
}

const Skeleton: FC<SkeletonProps> = memo(	({ width, height, circle, className }) => {
		const style: CSSProperties = {
			width,
			height,
		}

		return (
			<span
				className={cn(styles.skeleton, className, {
					[styles.circle]: circle,
				})}
				style={style}
			/>
		)
	},
)

export default Skeleton
