import styles from "./AplicationPage.module.scss"
import InputsApp from "./ui/InputsApp/InputsApp"
import BooleanChange from "./ui/BooleanChange/BooleanChange"
import PageHeader from "@shared/PageHeader/PageHeader"
import AboutBlocks from "./ui/AboutBlocks/AboutBlocks"
import ShowVariants from "./ui/ShowVariants/ShowVariants"

function AplicationPage() {
	return (
		<div className={styles.page}>
			<PageHeader
				title='Приложение'
				subtitle='Управление настройками приложения, ссылками и интеграциями.'
			/>

			<div className={styles.cards}>
				<InputsApp />

				<BooleanChange />

				<ShowVariants />

				<AboutBlocks />
			</div>
		</div>
	)
}

export default AplicationPage

