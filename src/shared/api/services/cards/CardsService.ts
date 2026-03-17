import { request } from "@shared/api/request"
import type {
	CreateUserCardPayload,
	DeleteUserCardPayload,
	GetUserCardsParams,
	GetUserCardsResponse,
	UpdateUserCardPayload,
	UpdateUserCardStatusPayload,
	UserCard,
} from "./types"

const buildUserCardsQuery = (params: GetUserCardsParams) => {
	const query = new URLSearchParams()
	if (params.search) query.set("search", params.search)
	if (params.status) query.set("status", params.status)
	if (params.languages?.length)
		query.set("languages", params.languages.join(","))
	if (typeof params.limit === "number") query.set("limit", String(params.limit))
	if (typeof params.offset === "number")
		query.set("offset", String(params.offset))

	const queryString = query.toString()
	return queryString ? `?${queryString}` : ""
}

class CardsService {
	getUserCards(params: GetUserCardsParams) {
		const query = buildUserCardsQuery(params)
		return request<GetUserCardsResponse>(
			`/admin/users/${params.userId}/cards${query}`,
			{ method: "GET" },
		)
	}

	createUserCard(payload: CreateUserCardPayload) {
		const { userId, ...body } = payload
		return request<UserCard>(`/admin/users/${userId}/cards`, {
			method: "POST",
			json: body,
		})
	}

	updateUserCard(payload: UpdateUserCardPayload) {
		const { userId, cardId, ...body } = payload
		return request<UserCard>(`/admin/users/${userId}/cards/${cardId}`, {
			method: "PUT",
			json: body,
		})
	}

	deleteUserCard(payload: DeleteUserCardPayload) {
		const { userId, cardId } = payload
		return request<{ deleted: number }>(
			`/admin/users/${userId}/cards/${cardId}`,
			{
				method: "DELETE",
			},
		)
	}

	updateUserCardStatus(payload: UpdateUserCardStatusPayload) {
		const { userId, cardId, status } = payload
		return request<UserCard>(`/admin/users/${userId}/cards/${cardId}/status`, {
			method: "PUT",
			json: { status },
		})
	}
}

export const cardsService = new CardsService()
