import cn from "classnames"
import React, { type FC, memo, type InputHTMLAttributes } from "react"
import styles from "./Input.module.scss"

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	children?: React.ReactNode
	classnames?: {
		inputWrapper?: string
	}
	/** Подсветить поле как ошибочное */
	isError?: boolean
}

const Input: FC<IInput> = memo(props => {
	const { className, classnames, isError, ...rest } = props

	return (
		<div className={cn(styles.inputWrapper, classnames?.inputWrapper)}>
			<input
				name='text'
				className={cn(styles.input, className, {
					[styles.inputError]: isError,
				})}
				aria-invalid={isError || undefined}
				{...rest}
			/>
		</div>
	)
})

export default Input
