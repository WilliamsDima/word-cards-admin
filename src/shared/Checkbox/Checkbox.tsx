import React, { FC, InputHTMLAttributes, memo, useMemo } from "react"
import cn from "classnames"
import styles from "./Checkbox.module.scss"

type CheckboxProps = Omit<InputHTMLAttributes<HTMLInputElement>, "type"> & {
	label?: React.ReactNode
	className?: string
	inputClassName?: string
	labelClassName?: string
}

const Checkbox: FC<CheckboxProps> = memo(
	({
		label,
		children,
		className,
		inputClassName,
		labelClassName,
		...rest
	}) => {
		const wrapperClassName = useMemo(
			() => cn(styles.checkbox, className),
			[className],
		)
		const inputClasses = useMemo(
			() => cn(styles.input, inputClassName),
			[inputClassName],
		)
		const labelClasses = useMemo(
			() => cn(styles.label, labelClassName),
			[labelClassName],
		)
		const content = useMemo(() => {
			return children ?? (label ? <span className={labelClasses}>{label}</span> : null)
		}, [children, label, labelClasses])

		return (
			<label className={wrapperClassName}>
				<input className={inputClasses} type='checkbox' {...rest} />
				{content}
			</label>
		)
	},
)

export default Checkbox
