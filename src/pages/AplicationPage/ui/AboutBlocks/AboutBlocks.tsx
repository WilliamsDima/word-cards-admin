import React from "react"
import styles from "./AboutBlocks.module.scss"
import Card from "@shared/Card/Card"
import AboutBlockList from "./AboutBlockList"

const AboutBlocks = () => {
	return (
		<Card className={styles.card}>
			<AboutBlockList />
		</Card>
	)
}

export default AboutBlocks
