import React, { FC, memo, useMemo, useState } from "react"
import Loading from "@shared/Loading/Loading"
import styles from "./SocialItem.module.scss"
import type { ISocial, SocialKeys } from "@shared/api/types"
import Input from "@shared/Input/Input"
import { Icon } from "@assets/icons/Icon"

type Props = {
	item: ISocial
	onDelete: (id: number | string) => void
	onSaveHandler: (id: number | string) => void
	onChangeInput: (
		e: React.ChangeEvent<HTMLInputElement>,
		it: ISocial,
		fieldName: SocialKeys,
	) => void
	index: number
	isLoading: boolean
	prevIt: ISocial | undefined
}

const SocialItem: FC<Props> = memo(
	({
		item,
		index,
		isLoading,
		prevIt,
		onDelete,
		onSaveHandler,
		onChangeInput,
	}) => {
		const [expanded, setExpanded] = useState(false)

		const isDirty = useMemo(() => {
			if (!prevIt) return true
			return (
				prevIt.key !== item.key ||
				prevIt.name !== item.name ||
				prevIt.icon !== item.icon ||
				prevIt.link !== item.link
			)
		}, [item, prevIt])

		const title = useMemo(
			() => item.name || prevIt?.name || "New social",
			[prevIt, item],
		)

		const onSave = () => onSaveHandler(item.id)
		const onExpanded = () => setExpanded(prev => !prev)
		const onDeleteHandler = (
			event: React.MouseEvent<SVGSVGElement, MouseEvent>,
		) => {
			event.stopPropagation()
			onDelete(item.id)
		}

		return (
			<div className={styles.group}>
				<button
					type='button'
					className={styles.groupNameBlock}
					onClick={onExpanded}
				>
					<Icon
						kind='svg'
						name='delete-red-64'
						onClick={onDeleteHandler}
						width={20}
						height={20}
					/>
					<p className={styles.index}>{index + 1}.</p>
					<p className={styles.blockName}>{title}</p>
					<span className={styles.chevron} data-open={expanded} />
				</button>

				<div className={styles.content} data-open={expanded}>
					<p className={styles.blockName}>Key</p>

					<div className={styles.inputWrapper}>
						<Input
							value={item.key}
							onChange={e => onChangeInput(e, item, "key")}
						/>
						{isDirty && !isLoading && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={onSave}
								width={28}
								height={28}
							/>
						)}
						{isLoading && <Loading className={styles.loader} />}
					</div>

					<p className={styles.blockName}>Name</p>

					<div className={styles.inputWrapper}>
						<Input
							value={item.name}
							onChange={e => onChangeInput(e, item, "name")}
						/>
						{isDirty && !isLoading && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={onSave}
								width={28}
								height={28}
							/>
						)}
						{isLoading && <Loading className={styles.loader} />}
					</div>

					<p className={styles.blockName}>Icon</p>

					<div className={styles.inputWrapper}>
						<Input
							value={item.icon}
							onChange={e => onChangeInput(e, item, "icon")}
						/>
						{isDirty && !isLoading && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={onSave}
								width={28}
								height={28}
							/>
						)}
						{isLoading && <Loading className={styles.loader} />}
					</div>

					<p className={styles.blockName}>Link</p>

					<div className={styles.inputWrapper}>
						<Input
							value={item.link}
							onChange={e => onChangeInput(e, item, "link")}
						/>
						{isDirty && !isLoading && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={onSave}
								width={28}
								height={28}
							/>
						)}
						{isLoading && <Loading className={styles.loader} />}
					</div>
				</div>
			</div>
		)
	},
)

export default SocialItem
