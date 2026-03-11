import { baseRTK } from "@app/api/BaseRTK"
import { request } from "@shared/api/request"
import { toRtkQueryResult } from "@shared/api/RTK/rtk"
import { IUser } from "../model/user"

class UsersService {
	getUsers() {
		return request<IUser[]>("/users", { method: "GET" })
	}
}

const usersService = new UsersService()

export const usersAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		// получение пользователей (backend)
		getUsers: builder.query<IUser[], void>({
			async queryFn() {
				return toRtkQueryResult(await usersService.getUsers())
			},
			providesTags: ["users"],
		}),
	}),
})

export const { useGetUsersQuery } = usersAPI
