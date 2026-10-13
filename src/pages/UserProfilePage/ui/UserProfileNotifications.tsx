import React, { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileNotifications.module.scss"
import Card from "@shared/Card/Card"
import Checkbox from "@shared/Checkbox/Checkbox"
import { useToast } from "@shared/Toast/useToast"
import { dateService } from "@shared/lib/date"
import {
	useGetUserNotificationSettingsQuery,
	useUpdateUserNotificationSettingsMutation,
} from "@shared/api/services/userNotificationSettings/UserNotificationSettingsQuery"

const UserProfileNotifications: React.FC = () => {
	const { id } = useParams()

	const { data, isLoading, isFetching, error } =
		useGetUserNotificationSettingsQuery(id ?? "", {
			skip: !id,
		})
	const [updateSettings, { isLoading: isUpdating }] =
		useUpdateUserNotificationSettingsMutation()
	const toast = useToast()

	const toggleLabel = useMemo(
		() =>
			data
				? `Ежедневное напоминание в ${data.daily_reminder_time}`
				: "Ежедневное напоминание",
		[data],
	)

	const devicesLabel = useMemo(
		() => (data ? data.devices_count.toLocaleString("ru-RU") : "—"),
		[data],
	)

	const lastReminderLabel = useMemo(() => {
		if (!data?.last_reminder_date) return "не отправлялось"
		return (
			dateService.formatISODate(data.last_reminder_date) ??
			data.last_reminder_date
		)
	}, [data])

	const hasNoDevices = useMemo(() => data?.devices_count === 0, [data])

	const isToggleDisabled = useMemo(
		() => !id || isUpdating || isFetching,
		[id, isFetching, isUpdating],
	)

	const errorMessage = useMemo(() => {
		if (!error) return ""
		if ("status" in error && error.status === 404) return "Пользователь не найден"
		return "Не удалось загрузить настройки уведомлений"
	}, [error])

	const onToggleReminder = useCallback(
		async (event: React.ChangeEvent<HTMLInputElement>) => {
			const { checked } = event.target
			if (!id) return
			try {
				await updateSettings({
					userId: id,
					daily_reminder_enabled: checked,
				}).unwrap()
				toast.success(
					checked ? "Напоминания включены" : "Напоминания отключены",
				)
			} catch (err) {
				const serverError =
					(err as { data?: { data?: { error?: string } } })?.data?.data
						?.error ?? null
				toast.error(
					"Ошибка сохранения",
					serverError || "Не удалось обновить настройки уведомлений",
				)
			}
		},
		[id, toast, updateSettings],
	)

	return (
		<Card className={styles.notificationsCard}>
			<div className={styles.header}>
				<h2 className={styles.title}>Уведомления</h2>
				<p className={styles.hint}>
					Ежедневные push-напоминания пользователю. Пользователь может снова
					включить напоминания в приложении.
				</p>
			</div>

			{isLoading ? (
				<div className={styles.loadingState}>Загружаем настройки...</div>
			) : (
				<></>
			)}

			{errorMessage ? (
				<div className={styles.errorState}>{errorMessage}</div>
			) : (
				<></>
			)}

			{data ? (
				<>
					<Checkbox
						className={styles.toggle}
						label={toggleLabel}
						checked={data.daily_reminder_enabled}
						onChange={onToggleReminder}
						disabled={isToggleDisabled}
					/>

					<div className={styles.valuesGrid}>
						<div className={styles.valueCard}>
							<div className={styles.value}>{devicesLabel}</div>
							<div className={styles.valueLabel}>Устройств для пушей</div>
						</div>
						<div className={styles.valueCard}>
							<div className={styles.value}>{lastReminderLabel}</div>
							<div className={styles.valueLabel}>Последнее напоминание</div>
						</div>
					</div>

					{hasNoDevices ? (
						<p className={styles.warning}>
							Нет зарегистрированных устройств — пуши никуда не уходят.
						</p>
					) : (
						<></>
					)}
				</>
			) : (
				<></>
			)}
		</Card>
	)
}

export default UserProfileNotifications
