import React, { useCallback, useMemo } from "react"
import { useParams } from "react-router-dom"
import styles from "./UserProfileStreak.module.scss"
import Button from "@shared/Button/Button"
import { useToast } from "@shared/Toast/useToast"
import { useGrantStreakFreezesMutation } from "@shared/api/services/userStreak/UserStreakQuery"
import {
	MAX_STREAK_FREEZES,
	type UserStreak,
} from "@shared/api/services/userStreak/types"

type Props = {
	streak: UserStreak
}

type GrantError = {
	status?: number | string
	data?: { data?: { error?: string } }
}

const getGrantErrorMessage = (err: unknown, maxFreezes: number) => {
	const { status, data } = (err ?? {}) as GrantError
	if (status === 409) {
		return `У пользователя уже максимум заморозок (${maxFreezes})`
	}
	if (status === 404) return "Пользователь не найден"
	return data?.data?.error || "Не удалось выдать заморозку"
}

const UserProfileStreakFreezes: React.FC<Props> = ({ streak }) => {
	const { id } = useParams()

	const [grantStreakFreezes, { isLoading }] = useGrantStreakFreezesMutation()
	const toast = useToast()

	const maxFreezes = useMemo(
		() => streak.max_freezes ?? MAX_STREAK_FREEZES,
		[streak.max_freezes],
	)

	// Старый бэкенд не присылает freezes_available — показываем прочерк
	const isSupported = useMemo(
		() => typeof streak.freezes_available === "number",
		[streak.freezes_available],
	)

	const freezesLabel = useMemo(
		() =>
			isSupported ? `${streak.freezes_available}/${maxFreezes}` : "—",
		[isSupported, maxFreezes, streak.freezes_available],
	)

	const isAtMax = useMemo(
		() => (streak.freezes_available ?? 0) >= maxFreezes,
		[maxFreezes, streak.freezes_available],
	)

	const isGrantDisabled = useMemo(
		() => isLoading || !id || !isSupported || isAtMax,
		[id, isAtMax, isLoading, isSupported],
	)

	const onGrant = useCallback(async () => {
		if (!id) return
		try {
			const result = await grantStreakFreezes({ userId: id }).unwrap()
			toast.success(
				"Заморозка выдана",
				`Заморозки: ${result.freezes_available ?? 0}/${result.max_freezes ?? maxFreezes}`,
			)
		} catch (err) {
			toast.error("Ошибка выдачи", getGrantErrorMessage(err, maxFreezes))
		}
	}, [grantStreakFreezes, id, maxFreezes, toast])

	return (
		<div className={styles.freezesRow}>
			<div className={styles.freezesValue}>Заморозки: {freezesLabel}</div>
			<Button
				className={styles.primaryBtn}
				onClick={onGrant}
				disabled={isGrantDisabled}
			>
				{isLoading ? "Выдаём..." : "Выдать"}
			</Button>
			{isSupported && isAtMax ? (
				<span className={styles.fieldHint}>
					Достигнут максимум — выдать больше нельзя.
				</span>
			) : (
				<></>
			)}
		</div>
	)
}

export default UserProfileStreakFreezes
