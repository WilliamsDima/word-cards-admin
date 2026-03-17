import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import cn from "classnames"
import styles from "./DropdownMultiselect.module.scss"
import { Icon } from "@assets/icons/Icon"

type Props<T extends Record<string, unknown>> = {
	options: T[]
	selected: T[]
	onChange: (next: T[]) => void
	labelKey: keyof T
	valueKey: keyof T
	placeholder?: string
	selectedLabel?: string
	emptyLabel?: string
}

const DropdownMultiselect = <T extends Record<string, unknown>>({
	options,
	selected,
	onChange,
	labelKey,
	valueKey,
	placeholder = "Выберите",
	selectedLabel,
	emptyLabel = "Нет данных",
}: Props<T>) => {
	const [open, setOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	const selectedSet = useMemo(() => {
		return new Set(selected.map(item => String(item?.[valueKey] ?? "")))
	}, [selected, valueKey])

	const isSelected = useCallback(
		(option: T) => {
			const key = String(option?.[valueKey] ?? "")
			return selectedSet.has(key)
		},
		[selectedSet, valueKey],
	)

	const displayLabel = useMemo(() => {
		if (selectedLabel) return selectedLabel
		if (selected.length === 0) return placeholder
		return `Выбрано: ${selected.length}`
	}, [placeholder, selected.length, selectedLabel])

	const toggleOpen = useCallback(() => {
		setOpen(prev => !prev)
	}, [])

	const onClear = useCallback(
		(event: React.MouseEvent<HTMLSpanElement>) => {
			event.stopPropagation()
			onChange([])
		},
		[onChange],
	)

	const handleSelect = useCallback(
		(option: T) => {
			const exists = isSelected(option)
			const key = String(option?.[valueKey] ?? "")
			const next = exists
				? selected.filter(item => String(item?.[valueKey] ?? "") !== key)
				: [...selected, option]
			onChange(next)
		},
		[isSelected, onChange, selected, valueKey],
	)

	const arrowClass = useMemo(
		() =>
			cn(styles.arrow, {
				[styles.open]: open,
			}),
		[open],
	)

	const optionItems = useMemo(() => {
		if (!options.length) {
			return [
				{
					key: "empty",
					label: emptyLabel,
					onClick: () => null,
					className: styles.optionEmpty,
					active: false,
				},
			]
		}

		return options.map(option => {
			const active = isSelected(option)
			const optionClass = cn(styles.option, {
				[styles.active]: active,
			})
			const onClick = () => handleSelect(option)
			const key = String(option?.[valueKey] ?? "")

			return {
				key,
				label: option?.[labelKey] as React.ReactNode,
				onClick,
				className: optionClass,
				active,
			}
		})
	}, [emptyLabel, handleSelect, isSelected, labelKey, options, valueKey])

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				dropdownRef.current &&
				!dropdownRef.current.contains(event.target as Node)
			) {
				setOpen(false)
			}
		}
		document.addEventListener("mousedown", handleClickOutside)
		return () => document.removeEventListener("mousedown", handleClickOutside)
	}, [])

	return (
		<div className={styles.dropdown} ref={dropdownRef}>
			<div className={styles.selected} onClick={toggleOpen}>
				<span className={styles.selectedLabel}>{displayLabel}</span>
				{selected.length > 0 ? (
					<span
						className={styles.clear}
						onClick={onClear}
						aria-label='Сбросить выбор'
					>
						<Icon kind='svg' name='close-white' width={20} height={20} />
					</span>
				) : (
					<span className={arrowClass} />
				)}
			</div>
			{open && (
				<ul className={styles.options}>
					{optionItems.map(option => (
						<li
							key={option.key}
							className={option.className}
							onClick={option.onClick}
						>
							{option.label}
							{option.active ? (
								<Icon kind='svg' name='done-v' width={20} height={20} />
							) : (
								<></>
							)}
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default DropdownMultiselect
