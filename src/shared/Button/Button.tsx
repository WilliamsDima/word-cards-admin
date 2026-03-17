import cn from "classnames"
import React, { FC, memo, ButtonHTMLAttributes, useMemo } from "react"
import styles from "./Button.module.scss"

interface IButton extends ButtonHTMLAttributes<HTMLButtonElement> {
	children: React.ReactNode
	pulseAnim?: boolean
	shadowClick?: boolean
}

const Button: FC<IButton> = memo(props => {
	const { children, pulseAnim, shadowClick = true, className, ...rest } = props
	const buttonClassName = useMemo(
		() =>
			cn(styles.btn, className, {
				[styles.pulse]: pulseAnim,
				[styles.shadowClick]: shadowClick,
			}),
		[className, pulseAnim, shadowClick],
	)

	return (
		<button type='button' className={buttonClassName} {...rest}>
			{children}
		</button>
	)
})

export default Button
