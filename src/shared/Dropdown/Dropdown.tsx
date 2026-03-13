import React, { useCallback, useEffect, useMemo, useRef, useState } from "react"
import styles from "./Dropdown.module.scss"
import cn from "classnames"

type DropdownProps<T extends Record<string, unknown>> = {
	options: T[]
	selected?: T
	onSelect?: (value: T) => void
	labelKey: keyof T
	valueKey: keyof T
}

const Dropdown = <T extends Record<string, unknown>>({
	options,
	selected,
	onSelect,
	labelKey,
	valueKey,
}: DropdownProps<T>) => {
	const [open, setOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

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

	const handleSelect = useCallback(
		(value: T) => {
			onSelect?.(value)
			setOpen(false)
		},
		[onSelect],
	)

	const toggleOpen = useCallback(() => {
		setOpen(prev => !prev)
	}, [])

	const arrowClass = useMemo(
		() =>
			cn(styles.arrow, {
				[styles.open]: open,
			}),
		[open],
	)

	const selectedLabel = useMemo(() => {
		return selected?.[labelKey] as React.ReactNode
	}, [labelKey, selected])

	const optionItems = useMemo(() => {
		return options.map(option => {
			const active = option?.[valueKey] === selected?.[valueKey]
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
			}
		})
	}, [handleSelect, labelKey, options, selected, valueKey])

	return (
		<div className={styles.dropdown} ref={dropdownRef}>
			<div className={styles.selected} onClick={toggleOpen}>
				<span>{selectedLabel}</span>
				<span className={arrowClass} />
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
						</li>
					))}
				</ul>
			)}
		</div>
	)
}

export default Dropdown
