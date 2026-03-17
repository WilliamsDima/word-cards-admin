import React, { useCallback, useMemo, useState } from "react"
import styles from "./UserProfileCards.module.scss"
import Badge from "@shared/Badge/Badge"
import Accordion from "@shared/Accordion/Accordion"
import { useToast } from "@shared/Toast/useToast"
import { useUpdateUserCardStatusMutation } from "@shared/api/services/cards/CardsQuery"
import type { CardStatus, UserCard } from "@shared/api/services/cards/types"
import type { LanguageItem } from "@shared/api/services/languages/types"
import { Icon } from "@assets/icons/Icon"
import cn from "classnames"

type Props = {
	card: UserCard
	userId: number | string
	language: LanguageItem | undefined
	onEdit: (card: UserCard) => void
	onDelete: (card: UserCard) => void
}

const statusLabels: Record<CardStatus, string> = {
	READY: "Готово",
	STUDY: "В изучении",
}

const statusVariants: Record<CardStatus, "success" | "warning"> = {
	READY: "success",
	STUDY: "warning",
}

const UserProfileCardItem: React.FC<Props> = ({
	card,
	userId,
	language,
	onEdit,
	onDelete,
}) => {
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
	const statusButtonLabel = useMemo(() => {
		return card.status === "READY" ? "Изучено" : "Изучить"
	}, [card.status])
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

	const statusIconName = useMemo(() => {
		return card.status === "READY" ? "done-green-48" : "translate"
	}, [card.status])

	const createdAt = useMemo(() => {
		return new Intl.DateTimeFormat("ru-RU", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(card.date))
	}, [card.date])

	const updatedAt = useMemo(() => {
		return new Intl.DateTimeFormat("ru-RU", {
			dateStyle: "medium",
			timeStyle: "short",
		}).format(new Date(card.updated_at))
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
		try {
			await updateStatus({
				userId,
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
		userId,
	])

	return (
		<div className={styles.cardItem}>
			<div className={styles.cardHeader}>
				<div className={styles.cardHeaderInfo}>
					<h3 className={styles.cardTitle}>{titleWord}</h3>
					<p className={styles.cardDescription}>{descriptionLabel}</p>
					<div className={styles.cardMetaRow}>
						<span className={styles.metaItem}>{languageLabel}</span>
						<span className={styles.metaItem}>Создано: {createdAt}</span>
						<span className={styles.metaItem}>Обновлено: {updatedAt}</span>
						<span className={styles.metaItem}>Слов: {itemsCount}</span>
						<Badge label={statusLabel} variant={statusVariant} />
					</div>
				</div>
				<div className={styles.cardActions}>
					<button
						type='button'
						className={editButtonClassName}
						onClick={onEditClick}
						aria-label='Редактировать карточку'
					>
						<Icon kind='svg' name='app' width={18} height={18} />
					</button>
					<button
						type='button'
						className={statusButtonClassName}
						onClick={onStatusClick}
						disabled={isStatusUpdating}
						aria-label={statusButtonLabel}
					>
						<Icon kind='svg' name={statusIconName} width={18} height={18} />
					</button>
					<button
						type='button'
						className={deleteButtonClassName}
						onClick={onDeleteClick}
						aria-label='Удалить карточку'
					>
						<Icon kind='svg' name='delete-red-64' width={18} height={18} />
					</button>
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
				contentClassName={styles.accordionContent}
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

export default UserProfileCardItem
