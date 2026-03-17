import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { cardsService } from "./CardsService"
import type {
	CreateUserCardPayload,
	DeleteUserCardPayload,
	GetUserCardsParams,
	GetUserCardsResponse,
	UpdateUserCardPayload,
	UpdateUserCardStatusPayload,
	UserCard,
} from "./types"

export const cardsAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getUserCards: builder.query<GetUserCardsResponse, GetUserCardsParams>({
			async queryFn(params) {
				return toRtkQueryResult(await cardsService.getUserCards(params))
			},
			providesTags: (_result, _error, params) => [
				{ type: "userCards", id: params.userId },
			],
		}),
		createUserCard: builder.mutation<UserCard, CreateUserCardPayload>({
			async queryFn(payload) {
				return toRtkQueryResult(await cardsService.createUserCard(payload))
			},
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userCards", id: payload.userId },
			],
		}),
		updateUserCard: builder.mutation<UserCard, UpdateUserCardPayload>({
			async queryFn(payload) {
				return toRtkQueryResult(await cardsService.updateUserCard(payload))
			},
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userCards", id: payload.userId },
			],
		}),
		deleteUserCard: builder.mutation<{ deleted: number }, DeleteUserCardPayload>({
			async queryFn(payload) {
				return toRtkQueryResult(await cardsService.deleteUserCard(payload))
			},
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userCards", id: payload.userId },
			],
		}),
		updateUserCardStatus: builder.mutation<UserCard, UpdateUserCardStatusPayload>({
			async queryFn(payload) {
				return toRtkQueryResult(
					await cardsService.updateUserCardStatus(payload),
				)
			},
			invalidatesTags: (_result, _error, payload) => [
				{ type: "userCards", id: payload.userId },
			],
		}),
	}),
})

export const {
	useGetUserCardsQuery,
	useCreateUserCardMutation,
	useUpdateUserCardMutation,
	useDeleteUserCardMutation,
	useUpdateUserCardStatusMutation,
} = cardsAPI
