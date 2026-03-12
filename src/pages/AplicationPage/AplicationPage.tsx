import { AppRoutes } from "@app/navigation/routes"
import Button from "@shared/Button/Button"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import styles from "./AplicationPage.module.scss"
import InputsApp from "./ui/InputsApp/InputsApp"
import BooleanChange from "./ui/BooleanChange/BooleanChange"
import PageHeader from "@shared/PageHeader/PageHeader"

function AplicationPage() {
	const navigation = useAppNavigate()

	const toTranslation = () => {
		navigation(AppRoutes.translation)
	}

	const toSocials = () => {
		navigation(AppRoutes.socials)
	}

	return (
		<div className={styles.page}>
			<PageHeader
				title='Приложение'
				subtitle='Управление настройками приложения, ссылками и интеграциями.'
			/>

			<div className={styles.card}>
				<InputsApp />

				<BooleanChange />

				<div className={styles.actions}>
					<Button className={styles.actionBtn} onClick={toSocials}>
						Соц. сети
					</Button>

					<Button className={styles.actionBtn} onClick={toTranslation}>
						Переводы
					</Button>
				</div>
			</div>
		</div>
	)
}

export default AplicationPage
