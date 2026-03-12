import React, { FC } from "react"
import cn from "classnames"
import styles from "./PageHeader.module.scss"

type Props = {
	title: string
	subtitle?: string
	className?: string
}

const PageHeader: FC<Props> = ({ title, subtitle, className }) => {
	return (
		<div className={cn(styles.header, className)}>
			<h1 className={styles.title}>{title}</h1>
			{subtitle ? <p className={styles.subtitle}>{subtitle}</p> : null}
		</div>
	)
}

export default PageHeader
