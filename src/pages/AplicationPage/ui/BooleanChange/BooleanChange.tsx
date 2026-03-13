import React, { useCallback, useEffect, useMemo, useState } from "react"
import styles from "./BooleanChange.module.scss"
import Select, { type SingleValue, StylesConfig } from "react-select"
import {
	useGetAppConfigQuery,
	useUpdateAppConfigMutation,
} from "@shared/api/services/appConfig/AppConfigQuery"
import { Icon } from "@assets/icons/Icon"
import { useToast } from "@shared/Toast/useToast"

type OptionVk = {
	value: boolean
	label: string
}

const optionsVk: OptionVk[] = [
	{ value: true, label: "true" },
	{ value: false, label: "false" },
]

const BooleanChange = () => {
	const { data } = useGetAppConfigQuery()
	const [updateConfig, { isLoading }] = useUpdateAppConfigMutation()
	const toast = useToast()

	const [showVKAuth, setShowVKAuth] = useState<
		SingleValue<OptionVk> | undefined
	>()

	const isChanged = useMemo(
		() =>
			data?.showVKAuth !== undefined &&
			showVKAuth?.value !== undefined &&
			data?.showVKAuth !== showVKAuth?.value,
		[data, showVKAuth],
	)

	const selectStyles: StylesConfig<OptionVk, false> = useMemo(
		() => ({
			control: (base, state) => ({
				...base,
				backgroundColor: "rgba(255, 255, 255, 0.06)",
				borderColor: state.isFocused ? "#1fb141" : "rgba(255, 255, 255, 0.08)",
				boxShadow: state.isFocused
					? "0 0 0 3px rgba(31, 177, 65, 0.15)"
					: "none",
				borderRadius: 12,
				minHeight: 42,
				color: "#e0e0e0",
			}),
			menu: base => ({
				...base,
				backgroundColor: "rgba(18, 18, 18, 0.95)",
				border: "1px solid rgba(255, 255, 255, 0.08)",
				boxShadow: "0 18px 40px rgba(0, 0, 0, 0.45)",
				borderRadius: 12,
				overflow: "hidden",
			}),
			option: (base, { isSelected, isFocused }) => ({
				...base,
				backgroundColor: isSelected
					? "rgba(31, 177, 65, 0.2)"
					: isFocused
						? "rgba(31, 177, 65, 0.12)"
						: "transparent",
				color: "#e0e0e0",
				cursor: "pointer",
			}),
			singleValue: base => ({
				...base,
				color: "#e0e0e0",
			}),
			placeholder: base => ({
				...base,
				color: "#a0a0a0",
			}),
			dropdownIndicator: base => ({
				...base,
				color: "#a0a0a0",
			}),
			indicatorSeparator: base => ({
				...base,
				backgroundColor: "rgba(255, 255, 255, 0.08)",
			}),
		}),
		[],
	)

	const onChangeVk = (newValue: SingleValue<OptionVk>) => {
		setShowVKAuth(newValue)
	}

	const save = useCallback(async () => {
		if (!data || showVKAuth?.value === undefined) return

		const nextConfig = {
			...data,
			showVKAuth: showVKAuth.value,
		}

		try {
			await updateConfig(nextConfig).unwrap()
			toast.success("Настройки обновлены")
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null
			toast.error("Ошибка сохранения", serverError || "Не удалось сохранить")
		}
	}, [data, showVKAuth, updateConfig, toast])

	useEffect(() => {
		if (data?.showVKAuth !== undefined)
			setShowVKAuth(optionsVk.find(it => it.value === data?.showVKAuth))
	}, [data])

	return (
		<div className={styles.block}>
			<p className={styles.label}>Авторизация через VK</p>

			<div className={styles.inputWrapper}>
				<Select
					isLoading={isLoading}
					options={optionsVk}
					value={showVKAuth}
					styles={selectStyles}
					onChange={onChangeVk}
					isSearchable={false}
					placeholder='Select'
				/>
				{isChanged && !isLoading && (
					<Icon
						kind='svg'
						name='done-green-48'
						onClick={save}
						width={28}
						height={28}
					/>
				)}
				{isLoading && <span className={styles.saving}>...</span>}
			</div>
		</div>
	)
}

export default BooleanChange
