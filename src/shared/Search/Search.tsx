import cn from "classnames"
import React, { FC, memo, InputHTMLAttributes } from "react"
import styles from "./Search.module.scss"
import SearchIcon from "@assets/icons/search.svg?react"

interface ISearch extends InputHTMLAttributes<HTMLInputElement> {
	children?: React.ReactNode
	classnames?: {
		inputWrapper?: string
	}
}

const Search: FC<ISearch> = memo(props => {
	const { className, classnames, ...rest } = props

	return (
		<div className={cn(styles.inputWrapper, classnames?.inputWrapper)}>
			<span className={styles.icon}>
				<SearchIcon />
			</span>

			<input
				type='search'
				name='search'
				className={cn(styles.input, className)}
				{...rest}
			/>
		</div>
	)
})

export default Search
