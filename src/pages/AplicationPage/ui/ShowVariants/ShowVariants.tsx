import React from "react"
import Card from "@shared/Card/Card"
import styles from "./ShowVariants.module.scss"
import ShowVariantsList from "./ShowVariantsList"

const ShowVariants = () => {
	return (
		<Card className={styles.card}>
			<ShowVariantsList />
		</Card>
	)
}

export default ShowVariants

