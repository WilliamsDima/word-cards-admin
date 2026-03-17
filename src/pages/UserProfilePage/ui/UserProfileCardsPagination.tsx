import React, { memo, useCallback, useMemo } from "react"
import cn from "classnames"
import styles from "./UserProfileCards.module.scss"

type Props = {
	total: number
	limit: number
	offset: number
	onPageChange: (page: number) => void
}

type PaginationButtonProps = {
	page: number
	isActive: boolean
	onClick: (page: number) => void
}

const buildPages = (currentPage: number, totalPages: number) => {
	const maxVisible = 5
	const safeTotal = Math.max(totalPages, 1)
	const start = Math.max(1, currentPage - Math.floor(maxVisible / 2))
	const end = Math.min(safeTotal, start + maxVisible - 1)
	const adjustedStart = Math.max(1, end - maxVisible + 1)

	return Array.from({ length: end - adjustedStart + 1 }, (_value, index) => {
		return adjustedStart + index
	})
}

const PaginationButton: React.FC<PaginationButtonProps> = memo(
	({ page, isActive, onClick }) => {
		const buttonClassName = useMemo(
			() =>
				cn(styles.pageBtn, {
					[styles.pageBtnActive]: isActive,
				}),
			[isActive],
		)

		const onClickHandler = useCallback(() => {
			onClick(page)
		}, [onClick, page])

		return (
			<button type='button' className={buttonClassName} onClick={onClickHandler}>
				{page}
			</button>
		)
	},
)

const UserProfileCardsPagination: React.FC<Props> = ({
	total,
	limit,
	offset,
	onPageChange,
}) => {
	const totalPages = useMemo(() => {
		const pages = Math.ceil(total / limit)
		return pages > 0 ? pages : 1
	}, [limit, total])

	const currentPage = useMemo(() => {
		return Math.min(totalPages, Math.floor(offset / limit) + 1)
	}, [limit, offset, totalPages])

	const pages = useMemo(
		() => buildPages(currentPage, totalPages),
		[currentPage, totalPages],
	)

	const isPrevDisabled = useMemo(() => currentPage <= 1, [currentPage])
	const isNextDisabled = useMemo(
		() => currentPage >= totalPages,
		[currentPage, totalPages],
	)

	const onPrev = useCallback(() => {
		onPageChange(Math.max(1, currentPage - 1))
	}, [currentPage, onPageChange])

	const onNext = useCallback(() => {
		onPageChange(Math.min(totalPages, currentPage + 1))
	}, [currentPage, onPageChange, totalPages])

	const onPageClick = useCallback(
		(page: number) => {
			onPageChange(page)
		},
		[onPageChange],
	)

	return (
		<div className={styles.pagination}>
			<div className={styles.pageControls}>
				<button
					type='button'
					className={styles.pageBtn}
					onClick={onPrev}
					disabled={isPrevDisabled}
				>
					Назад
				</button>
				{pages.map(page => (
					<PaginationButton
						key={page}
						page={page}
						isActive={page === currentPage}
						onClick={onPageClick}
					/>
				))}
				<button
					type='button'
					className={styles.pageBtn}
					onClick={onNext}
					disabled={isNextDisabled}
				>
					Вперёд
				</button>
			</div>
			<div className={styles.pageInfo}>
				Страница {currentPage} из {totalPages}
			</div>
		</div>
	)
}

export default UserProfileCardsPagination
