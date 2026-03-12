import React, { FC } from "react"
import cn from "classnames"
import styles from "./Card.module.scss"

type Props = {
	children: React.ReactNode
	className?: string
}

const Card: FC<Props> = ({ children, className }) => {
	return <div className={cn(styles.card, className)}>{children}</div>
}

export default Card
