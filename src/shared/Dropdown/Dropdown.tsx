import React, { useState, useRef, useEffect } from "react"
import styles from "./Dropdown.module.scss"
import cn from "classnames"

interface DropdownProps {
	options: any[]
	selected?: any
	onSelect?: (value: any) => void
	labelKey: string
	valueKey: string
}

const Dropdown: React.FC<DropdownProps> = ({
	options,
	selected,
	onSelect,
	labelKey,
	valueKey,
}) => {
	const [open, setOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)

	// Закрытие при клике вне компонента
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

	const handleSelect = (value: any) => {
		onSelect?.(value)
		setOpen(false)
	}

	return (
		<div className={styles.dropdown} ref={dropdownRef}>
			<div className={styles.selected} onClick={() => setOpen(!open)}>
				<span>{selected?.[labelKey]}</span>
				<span
					className={cn(styles.arrow, {
						[styles.open]: open,
					})}
				/>
			</div>
			{open && (
				<ul className={styles.options}>
					{options.map(option => {
						const active = option?.[valueKey] === selected?.[valueKey]
						return (
							<li
								className={cn(styles.option, {
									[styles.active]: active,
								})}
								key={option?.[valueKey]}
								onClick={() => handleSelect(option)}
							>
								{option?.[labelKey]}
							</li>
						)
					})}
				</ul>
			)}
		</div>
	)
}

export default Dropdown
