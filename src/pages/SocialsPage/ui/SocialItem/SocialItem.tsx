import React, { FC, memo, useCallback, useMemo, useState } from "react"
import Loading from "@shared/Loading/Loading"
import styles from "./SocialItem.module.scss"
import Input from "@shared/Input/Input"
import { Icon } from "@assets/icons/Icon"
import type { ISocial, SocialKeys } from "@shared/api/services/appConfig/types"
import Accordion from "@shared/Accordion/Accordion"

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

		const onSave = useCallback(() => onSaveHandler(item.id), [item.id, onSaveHandler])
		const onExpanded = useCallback(() => {
			setExpanded(prev => !prev)
		}, [])
		const onDeleteHandler = useCallback(
			(event: React.MouseEvent<SVGSVGElement, MouseEvent>) => {
				event.stopPropagation()
				onDelete(item.id)
			},
			[item.id, onDelete],
		)

		const onChangeKey = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) => onChangeInput(e, item, "key"),
			[item, onChangeInput],
		)
		const onChangeName = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeInput(e, item, "name"),
			[item, onChangeInput],
		)
		const onChangeIcon = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeInput(e, item, "icon"),
			[item, onChangeInput],
		)
		const onChangeLink = useCallback(
			(e: React.ChangeEvent<HTMLInputElement>) =>
				onChangeInput(e, item, "link"),
			[item, onChangeInput],
		)

		const onToggleHandler = useCallback(() => {
			onExpanded()
		}, [onExpanded])

		const renderHeader = useCallback(
			(open: boolean) => (
				<>
					<Icon
						kind='svg'
						name='delete-red-64'
						onClick={onDeleteHandler}
						width={20}
						height={20}
					/>
					<p className={styles.index}>{index + 1}.</p>
					<p className={styles.blockName}>{title}</p>
					<span className={styles.chevron} data-open={open} />
				</>
			),
			[index, onDeleteHandler, title],
		)

		return (
			<Accordion
				open={expanded}
				onOpenChange={onToggleHandler}
				className={styles.group}
				headerClassName={styles.groupNameBlock}
				contentClassName={styles.content}
				header={renderHeader}
			>
				<p className={styles.blockName}>Key</p>

				<div className={styles.inputWrapper}>
					<Input value={item.key} onChange={onChangeKey} />
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
					<Input value={item.name} onChange={onChangeName} />
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
					<Input value={item.icon} onChange={onChangeIcon} />
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
					<Input value={item.link} onChange={onChangeLink} />
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
			</Accordion>
		)
	},
)

export default SocialItem
