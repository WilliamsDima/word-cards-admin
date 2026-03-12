import React, { FC, HTMLAttributes } from "react"
import cn from "classnames"
import styles from "./Card.module.scss"

type Props = HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode
}

const Card: FC<Props> = ({ children, className, ...rest }) => {
	return (
		<div className={cn(styles.card, className)} {...rest}>
			{children}
		</div>
	)
}

export default Card
