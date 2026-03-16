import React, { memo, useCallback, useEffect, useMemo, useState } from "react"
import styles from "./ShowVariants.module.scss"
import Button from "@shared/Button/Button"
import Loading from "@shared/Loading/Loading"
import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { useToast } from "@shared/Toast/useToast"
import type { ShowVariantsOption } from "@shared/api/services/appConfig/types"
import ShowVariantItem from "./ShowVariantItem"

const ShowVariantsList: React.FC = memo(() => {
	const [autoOpenIndex, setAutoOpenIndex] = useState<number | null>(null)

	const { data, isLoading, isError } = useGetAppConfigQuery()
	const [updateConfig, { isLoading: isSaving }] =
		useUpdateAppConfigMutation()
	const toast = useToast()

	const serverVariants = useMemo<ShowVariantsOption[]>(
		() => data?.showVariantsList ?? [],
		[data],
	)

	const isEmpty = useMemo(
		() => !isLoading && !isError && serverVariants.length === 0,
		[isError, isLoading, serverVariants.length],
	)

	const isAddDisabled = useMemo(
		() => isSaving || !data,
		[data, isSaving],
	)

	const addLabel = useMemo(
		() => (isSaving ? "Создание..." : "Добавить вариант"),
		[isSaving],
	)
	const titleLabel = useMemo(() => "Варианты отображения перевода", [])
	const subtitleLabel = useMemo(
		() =>
			"Добавляйте варианты отображения перевода, доступные в мобильном приложении.",
		[],
	)
	const loadingLabel = useMemo(() => "Загружаем варианты...", [])
	const emptyTitle = useMemo(() => "Нет вариантов", [])
	const emptyText = useMemo(
		() => "Добавьте первый вариант, чтобы настроить отображение.",
		[],
	)
	const errorTitle = useMemo(() => "Не удалось загрузить варианты", [])
	const errorText = useMemo(
		() => "Проверьте подключение и повторите попытку позже.",
		[],
	)

	const onAddVariant = useCallback(async () => {
		if (!data) return
		const nextVariants: ShowVariantsOption[] = [
			...serverVariants,
			{
				value: "",
				label: "",
			},
		]
		const nextConfig = {
			...data,
			showVariantsList: nextVariants,
		}

		try {
			await updateConfig(nextConfig).unwrap()
			setAutoOpenIndex(nextVariants.length - 1)
			toast.success("Вариант добавлен")
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data
					?.error ?? null
			toast.error(
				"Ошибка создания",
				serverError || "Не удалось добавить вариант",
			)
		}
	}, [data, serverVariants, toast, updateConfig])

	useEffect(() => {
		if (autoOpenIndex === null) return
		if (autoOpenIndex < serverVariants.length) {
			setAutoOpenIndex(null)
		}
	}, [autoOpenIndex, serverVariants.length])

	return (
		<>
			<div className={styles.header}>
				<div>
					<h2 className={styles.title}>{titleLabel}</h2>
					<p className={styles.subtitle}>{subtitleLabel}</p>
				</div>
				<Button
					className={styles.addBtn}
					onClick={onAddVariant}
					disabled={isAddDisabled}
				>
					{addLabel}
				</Button>
			</div>

			{isLoading ? (
				<div className={styles.loading}>
					<Loading className={styles.spinner} />
					<span>{loadingLabel}</span>
				</div>
			) : null}

			{isError && !isLoading ? (
				<div className={styles.empty}>
					<span className={styles.emptyTitle}>{errorTitle}</span>
					<span className={styles.emptyText}>{errorText}</span>
				</div>
			) : null}

			{!isLoading && !isError ? (
				isEmpty ? (
					<div className={styles.empty}>
						<span className={styles.emptyTitle}>{emptyTitle}</span>
						<span className={styles.emptyText}>{emptyText}</span>
					</div>
				) : (
					<div className={styles.list}>
						{serverVariants.map((variant, index) => (
							<ShowVariantItem
								key={`${variant.value}-${variant.label}-${index}`}
								variant={variant}
								appConfig={data}
								autoOpen={index === autoOpenIndex}
							/>
						))}
					</div>
				)
			) : null}
		</>
	)
})

export default ShowVariantsList
