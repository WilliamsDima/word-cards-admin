import { baseRTK } from "@app/api/BaseRTK"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { usersService } from "./UsersServices"
import { IUser } from "./types"

export const usersAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		getUsers: builder.query<IUser[], void>({
			async queryFn() {
				return toRtkQueryResult(await usersService.getUsers())
			},
			providesTags: ["users"],
		}),
	}),
})

export const { useGetUsersQuery } = usersAPI
