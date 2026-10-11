import { request } from "@shared/api/request"
import type {
	CreateUserCardPayload,
	DeleteUserCardPayload,
	GetUserCardsParams,
	GetUserCardsResponse,
	CardsImportReport,
	ImportUserCardsPayload,
	UpdateUserCardPayload,
	UpdateUserCardStatusPayload,
	UserCard,
} from "./types"

// Файл до 10 МБ — общий таймаут http-клиента (15 с) для него слишком мал
const CARDS_IMPORT_TIMEOUT_MS = 120_000

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

	/**
	 * Импорт карточек из JSON-файла. Тело — сырое содержимое файла (не multipart).
	 * dryRun=true — только проверка и отчёт, без записи.
	 * Без dryRun при валидном файле ВСЕ карточки пользователя заменяются данными из файла.
	 */
	importUserCards(payload: ImportUserCardsPayload, dryRun: boolean) {
		const { userId, fileContent } = payload
		const query = dryRun ? "?dry_run=true" : ""
		return request<CardsImportReport>(
			`/admin/users/${userId}/cards/import${query}`,
			{
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: fileContent,
				timeout: CARDS_IMPORT_TIMEOUT_MS,
			},
		)
	}
}

export const cardsService = new CardsService()
