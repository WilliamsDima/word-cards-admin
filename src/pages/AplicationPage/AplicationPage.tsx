import styles from "./AplicationPage.module.scss"
import InputsApp from "./ui/InputsApp/InputsApp"
import BooleanChange from "./ui/BooleanChange/BooleanChange"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"

function AplicationPage() {
	return (
		<div className={styles.page}>
			<PageHeader
				title='Приложение'
				subtitle='Управление настройками приложения, ссылками и интеграциями.'
			/>

			<Card className={styles.card}>
				<InputsApp />

				<BooleanChange />
			</Card>
		</div>
	)
}

export default AplicationPage
