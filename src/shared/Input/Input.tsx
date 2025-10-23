import cn from "classnames"
import React, { FC, memo, InputHTMLAttributes } from "react"
import styles from "./Input.module.scss"

interface IInput extends InputHTMLAttributes<HTMLInputElement> {
	children?: React.ReactNode
	classnames?: {
		inputWrapper?: string
	}
}

const Input: FC<IInput> = memo(props => {
	const { className, classnames, ...rest } = props

	return (
		<div className={cn(styles.inputWrapper, classnames?.inputWrapper)}>
			<input name='text' className={cn(styles.input, className)} {...rest} />
		</div>
	)
})

export default Input
