export type CardStatus = "READY" | "STUDY"

export const statusLabels: Record<CardStatus, string> = {
	READY: "Готово",
	STUDY: "В изучении",
}

export const statusValues: Record<CardStatus, CardStatus> = {
	READY: "READY",
	STUDY: "STUDY",
}

export const statusVariants: Record<CardStatus, "success" | "warning"> = {
	READY: "success",
	STUDY: "warning",
}

export const statusOptions = [
	{ label: statusLabels.STUDY, value: statusValues.STUDY },
	{ label: statusLabels.READY, value: statusValues.READY },
]

export type UserCardItem = {
	id: number
	word: string
	translate: string
	date: string
}

export type UserCard = {
	id: number
	user_id: number
	language: string
	description: string
	status: CardStatus
	items: UserCardItem[]
	date: string
	updated_at: string
}

export type GetUserCardsResponse = {
	items: UserCard[]
	total: number
	limit: number
	offset: number
}

export type GetUserCardsParams = {
	userId: number | string
	search?: string
	status?: CardStatus
	languages?: string[]
	limit?: number
	offset?: number
}

export type CardItemPayload = {
	word: string
	translate: string
}

export type CreateUserCardPayload = {
	userId: number | string
	language: string
	description?: string
	status?: CardStatus
	items: CardItemPayload[]
}

export type UpdateUserCardPayload = {
	userId: number | string
	cardId: number
	language: string
	description?: string
	items: CardItemPayload[]
}

export type DeleteUserCardPayload = {
	userId: number | string
	cardId: number
}

export type UpdateUserCardStatusPayload = {
	userId: number | string
	cardId: number
	status: CardStatus
}
