import { AppRoutes } from "@app/navigation/routes"
import Button from "@shared/Button/Button"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import styles from "./AplicationPage.module.scss"
import InputsApp from "./ui/InputsApp/InputsApp"
import BooleanChange from "./ui/BooleanChange/BooleanChange"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"

function AplicationPage() {
	const navigation = useAppNavigate()

	const toTranslation = () => {
		navigation(AppRoutes.translation)
	}

	return (
		<div className={styles.page}>
			<PageHeader
				title='Приложение'
				subtitle='Управление настройками приложения, ссылками и интеграциями.'
			/>

			<Card className={styles.card}>
				<InputsApp />

				<BooleanChange />

				<div className={styles.actions}>
					<Button className={styles.actionBtn} onClick={toTranslation}>
						Переводы
					</Button>
				</div>
			</Card>
		</div>
	)
}

export default AplicationPage
