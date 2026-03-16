import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { usersService } from "./UsersServices"
import { IUser, UpdateUserLanguagesPayload } from "./types"

export const usersAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getUsers: builder.query<IUser[], string | undefined>({
			async queryFn(search) {
				return toRtkQueryResult(await usersService.getUsers(search))
			},
			providesTags: ["users"],
		}),
		getUserById: builder.query<IUser, string | number>({
			async queryFn(id) {
				return toRtkQueryResult(await usersService.getUserById(id))
			},
			providesTags: (_result, _error, id) => [{ type: "users", id }],
		}),
		updateUserLanguages: builder.mutation<IUser, UpdateUserLanguagesPayload>({
			async queryFn({ id, languages }) {
				return toRtkQueryResult(
					await usersService.updateUserLanguages(id, languages),
				)
			},
			invalidatesTags: (_result, _error, { id }) => [
				{ type: "users", id },
				"users",
			],
		}),
	}),
})

export const {
	useGetUsersQuery,
	useGetUserByIdQuery,
	useUpdateUserLanguagesMutation,
} = usersAPI
