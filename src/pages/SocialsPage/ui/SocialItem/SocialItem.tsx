import React, { FC, memo } from "react"
import Loading from "@shared/Loading/Loading"
import styles from "./SocialItem.module.scss"
import type { ISocial, SocialKeys } from "@shared/api/types"
import Input from "@shared/Input/Input"
import { Icon } from "@assets/icons/Icon"

type Props = {
	item: ISocial
	onDelete: (id: number) => void
	onSaveHandler: () => void
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
		const onDeleteHandler = () => onDelete(item.id)
		return (
			<div className={styles.group}>
				<div className={styles.groupNameBlock}>
					<Icon
						kind='svg'
						name='delete-red-64'
						onClick={onDeleteHandler}
						width={25}
						height={25}
					/>
					<p className={styles.index}>{index + 1}.</p>
					<p className={styles.blockName}>
						{item.id === 10 ? item.name : prevIt?.name}
					</p>
				</div>

				<>
					<p className={styles.blockName}>Key</p>

					<div className={styles.inputWrapper}>
						<Input
							value={item.key}
							onChange={e => onChangeInput(e, item, "key")}
						/>
						{prevIt && prevIt?.key !== item.key && (
							<Icon
								kind='svg'
								name='done-green-48'
								onClick={onSaveHandler}
								width={28}
								height={28}
							/>
						)}
						{isLoading && <Loading className={styles.loader} />}
					</div>
				</>

				<p className={styles.blockName}>Name</p>

				<div className={styles.inputWrapper}>
					<Input
						value={item.name}
						onChange={e => onChangeInput(e, item, "name")}
					/>
					{prevIt && prevIt?.name !== item.name && (
						<Icon
							kind='svg'
							name='done-green-48'
							onClick={onSaveHandler}
							width={28}
							height={28}
						/>
					)}
					{isLoading && <Loading className={styles.loader} />}
				</div>

				<p className={styles.blockName}>icon</p>

				<div className={styles.inputWrapper}>
					<Input
						value={item.icon}
						onChange={e => onChangeInput(e, item, "icon")}
					/>
					{prevIt && prevIt?.icon !== item.icon && (
						<Icon
							kind='svg'
							name='done-green-48'
							onClick={onSaveHandler}
							width={28}
							height={28}
						/>
					)}
					{isLoading && <Loading className={styles.loader} />}
				</div>

				<p className={styles.blockName}>link</p>

				<div className={styles.inputWrapper}>
					<Input
						value={item.link}
						onChange={e => onChangeInput(e, item, "link")}
					/>
					{prevIt && prevIt?.link !== item.link && (
						<Icon
							kind='svg'
							name='done-green-48'
							onClick={onSaveHandler}
							width={28}
							height={28}
						/>
					)}
					{isLoading && <Loading className={styles.loader} />}
				</div>

				{item.id === 10 && (
					<span className={styles.save} onClick={onSaveHandler}>
						<Icon
							kind='svg'
							name='done-green-48'
							onClick={onSaveHandler}
							width={28}
							height={28}
						/>
						Добавить
					</span>
				)}
			</div>
		)
	},
)

export default SocialItem
