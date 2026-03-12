import React, { useState } from "react"
import {
	useGoogleLoginMutation,
	useLazyMeQuery,
} from "@shared/api/services/auth/AuthQuery"
import { useActions } from "@shared/hooks/useActions"
import { signInWithGoogle } from "@shared/config/firebaseAuth"
import Button from "@shared/Button/Button"
import { Icon } from "@assets/icons/Icon"
import styles from "./LoginPage.module.scss"
import { clearAuthToken } from "@shared/lib/authToken"

function LoginPage() {
	const { setIsAdmin } = useActions()
	const [googleLogin] = useGoogleLoginMutation()
	const [fetchMe] = useLazyMeQuery()
	const [googleLoading, setGoogleLoading] = useState(false)
	const [googleError, setGoogleError] = useState<string | null>(null)

	const getErrorMessage = (err: unknown) => {
		if (err && typeof err === "object" && "status" in err) {
			const status = (err as { status?: number }).status
			const data = (err as { data?: { error?: string } }).data

			if (status === 403 || data?.error === "admin only") {
				return "Доступ запрещен. Вход разрешен только администраторам."
			}

			if (status === 401) {
				return "Не удалось авторизоваться. Попробуйте ещё раз."
			}

			if (data?.error) return data.error
		}

		return err instanceof Error ? err.message : "Login error"
	}

	const onGoogleLogin = async () => {
		setGoogleLoading(true)
		setGoogleError(null)
		try {
			const { idToken } = await signInWithGoogle()
			await googleLogin({ idToken }).unwrap()
			await fetchMe().unwrap()
			setIsAdmin(true)
		} catch (err) {
			clearAuthToken()
			setIsAdmin(false)
			setGoogleError(getErrorMessage(err))
		} finally {
			setGoogleLoading(false)
		}
	}

	return (
		<div className={styles.container}>
			<div className={styles.glow} />
			<div className={styles.card}>
				<section className={styles.brand}>
					<div className={styles.brandTop}>
						<span className={styles.badge}>Word Cards</span>
						<span className={styles.version}>Admin</span>
					</div>
					<h1 className={styles.title}>Вход в панель</h1>
					<p className={styles.subtitle}>
						Собирайте словари, проверяйте прогресс и управляйте контентом в
						одном месте.
					</p>
					<ul className={styles.benefits}>
						<li>Быстрое добавление карточек</li>
						<li>Журнал действий команды</li>
						<li>Экспорт и аналитика</li>
					</ul>
				</section>

				<section className={styles.login}>
					<h2 className={styles.loginTitle}>Войти</h2>
					<p className={styles.loginHint}>
						Используйте Google-аккаунт администратора.
					</p>
					<Button
						className={styles.btn}
						type='button'
						onClick={onGoogleLogin}
						disabled={googleLoading}
					>
						<span>
							{googleLoading ? "Загрузка..." : "Войти с помощью Google"}
						</span>
						<Icon kind='svg' name='google' width={22} height={22} />
					</Button>
					{googleError ? <p className={styles.error}>{googleError}</p> : null}
					<p className={styles.footerNote}>
						Если нет доступа, напишите владельцу проекта.
					</p>
				</section>
			</div>
		</div>
	)
}

export default LoginPage
