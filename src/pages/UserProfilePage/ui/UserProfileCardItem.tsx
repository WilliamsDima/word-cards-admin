import React, { memo, useCallback, useMemo, useState } from "react"
import styles from "./UserProfileCards.module.scss"
import Badge from "@shared/Badge/Badge"
import Accordion from "@shared/Accordion/Accordion"
import { useToast } from "@shared/Toast/useToast"
import { useUpdateUserCardStatusMutation } from "@shared/api/services/cards/CardsQuery"
import {
	statusLabels,
	statusVariants,
	type CardStatus,
	type UserCard,
} from "@shared/api/services/cards/types"
import type { LanguageItem } from "@shared/api/services/languages/types"
import { Icon } from "@assets/icons/Icon"
import cn from "classnames"
import Button from "@shared/Button/Button"
import { useParams } from "react-router-dom"

type Props = {
	card: UserCard
	language: LanguageItem | undefined
	onEdit: (card: UserCard) => void
	onDelete: (card: UserCard) => void
}

const UserProfileCardItem: React.FC<Props> = ({
	card,
	language,
	onEdit,
	onDelete,
}) => {
	const { id } = useParams()

	const [isWordsOpen, setIsWordsOpen] = useState(false)
	const [updateStatus, { isLoading: isStatusUpdating }] =
		useUpdateUserCardStatusMutation()
	const toast = useToast()

	const languageLabel = useMemo(() => {
		return language ? `${language.emoji} ${language.name}` : card.language
	}, [card.language, language])

	const titleWord = useMemo(() => {
		return card.items[0]?.word || "Без слов"
	}, [card.items])

	const statusLabel = useMemo(() => statusLabels[card.status], [card.status])
	const statusVariant = useMemo(
		() => statusVariants[card.status],
		[card.status],
	)

	const nextStatus = useMemo<CardStatus>(() => {
		return card.status === "READY" ? "STUDY" : "READY"
	}, [card.status])

	const statusButtonClassName = useMemo(() => {
		return cn(styles.iconButton, {
			[styles.iconButtonStatusReady]: card.status === "READY",
			[styles.iconButtonStatusStudy]: card.status === "STUDY",
		})
	}, [card.status])

	const editButtonClassName = useMemo(
		() => cn(styles.iconButton, styles.iconButtonEdit),
		[],
	)
	const deleteButtonClassName = useMemo(
		() => cn(styles.iconButton, styles.iconButtonDanger),
		[],
	)

	const createdAt = useMemo(() => {
		return `Создано: ${new Intl.DateTimeFormat("ru-RU", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(card.date))}`
	}, [card.date])

	const updatedAt = useMemo(() => {
		return `Обновлено: ${new Intl.DateTimeFormat("ru-RU", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(card.updated_at))}`
	}, [card.updated_at])

	const itemsCount = useMemo(() => card.items.length, [card.items.length])
	const descriptionLabel = useMemo(() => {
		return card.description?.trim().length
			? card.description
			: "Описание не задано"
	}, [card.description])

	const onEditClick = useCallback(() => onEdit(card), [card, onEdit])
	const onDeleteClick = useCallback(() => onDelete(card), [card, onDelete])

	const onStatusClick = useCallback(async () => {
		if (!id) return
		try {
			await updateStatus({
				userId: id,
				cardId: card.id,
				status: nextStatus,
			}).unwrap()
			toast.success("Статус обновлён", descriptionLabel || languageLabel)
		} catch (err) {
			const serverError =
				(err as { data?: { data?: { error?: string } } })?.data?.data?.error ??
				null
			toast.error(
				"Ошибка обновления",
				serverError || "Не удалось изменить статус",
			)
		}
	}, [
		card.id,
		descriptionLabel,
		languageLabel,
		nextStatus,
		toast,
		updateStatus,
		id,
	])

	return (
		<div className={styles.cardItem}>
			<div className={styles.cardHeader}>
				<div className={styles.cardHeaderInfo}>
					<h3 className={styles.cardTitle}>{titleWord}</h3>
					<p className={styles.cardDescription}>{descriptionLabel}</p>
					<div className={styles.cardMetaRow}>
						<Badge label={languageLabel} variant='neutral' />
						<Badge label={createdAt} variant='info' />
						<Badge label={updatedAt} variant='info' />
						<Badge label={statusLabel} variant={statusVariant} />
					</div>
				</div>
				<div className={styles.cardActions}>
					<Button className={editButtonClassName} onClick={onEditClick}>
						<Icon kind='svg' name='edit' width={18} height={18} />
					</Button>

					<Button
						className={statusButtonClassName}
						onClick={onStatusClick}
						disabled={isStatusUpdating}
					>
						<Icon kind='svg' name='arrow-change' width={18} height={18} />
					</Button>

					<Button className={deleteButtonClassName} onClick={onDeleteClick}>
						<Icon kind='svg' name='delete-red-64' width={18} height={18} />
					</Button>
				</div>
			</div>
			<Accordion
				header={
					<div className={styles.accordionHeader}>
						<span>Слова ({itemsCount})</span>
					</div>
				}
				className={styles.accordion}
				headerClassName={styles.accordionHeaderButton}
				open={isWordsOpen}
				onOpenChange={setIsWordsOpen}
			>
				<ul className={styles.itemsList}>
					{card.items.map(item => (
						<li key={item.id} className={styles.itemRow}>
							<span className={styles.itemWord}>{item.word}</span>
							<span className={styles.itemTranslate}>{item.translate}</span>
						</li>
					))}
				</ul>
			</Accordion>
		</div>
	)
}

export default memo(UserProfileCardItem)
