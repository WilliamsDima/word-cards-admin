import { AppRoutes } from "@app/navigation/routes"
import Button from "@shared/Button/Button"
import { useAppNavigate } from "@shared/hooks/useAppNavigate"
import styles from "./AplicationPage.module.scss"
import { useAppSelector } from "@shared/hooks/useStore"
import InputsApp from "./ui/InputsApp/InputsApp"
import BooleanChange from "./ui/BooleanChange/BooleanChange"

function AplicationPage() {
	const navigation = useAppNavigate()

	const { firebaseApp } = useAppSelector(store => store.app)

	const toTranslation = () => {
		navigation(AppRoutes.translation)
	}

	return (
		<div className={styles.container}>
			<InputsApp />

			<BooleanChange />

			<Button className={styles.translate} onClick={toTranslation}>
				Переводы
			</Button>
		</div>
	)
}

export default AplicationPage
