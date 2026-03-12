import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { usersService } from "./UsersServices"
import { IUser } from "./types"

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
	}),
})

export const { useGetUsersQuery, useGetUserByIdQuery } = usersAPI
