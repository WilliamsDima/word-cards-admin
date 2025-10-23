import React, { FC, memo, SVGProps } from "react"
import styles from "./Loading.module.scss"
import cn from "classnames"

type Props = {} & SVGProps<SVGSVGElement>

const Loading: FC<Props> = memo(({ className, ...props }) => {
	return (
		<svg
			viewBox='25 25 50 50'
			className={cn(styles.loading, className)}
			{...props}
		>
			<circle r='20' cy='50' cx='50'></circle>
		</svg>
	)
})

export default Loading
