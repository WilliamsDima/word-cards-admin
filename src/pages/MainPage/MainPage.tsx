import styles from "./MainPage.module.scss"
import PageHeader from "@shared/PageHeader/PageHeader"
import Card from "@shared/Card/Card"
import { AppRoutes } from "@app/navigation/routes"

function MainPage() {
	return (
		<div className={styles.page}>
			<Card className={styles.card}>
				<PageHeader
					title='Admin overview'
					subtitle='Quick entry point for product resources and download links.'
				/>
				{/* Полная загрузка страницы: /download рендерится публичным роутером без auth-гейта */}
				<a
					href={AppRoutes.download}
					target='_blank'
					rel='noreferrer'
					className={styles.link}
				>
					Страница скачивания приложения (APK)
				</a>
			</Card>
		</div>
	)
}

export default MainPage
