import { baseRTK } from "@app/api/BaseRTK"
import { IUser } from "../model/user"

export const usersAPI = baseRTK.injectEndpoints({
	endpoints: builder => ({
		// получение пользователей (backend)
		getUsers: builder.query<IUser[], void>({
			query: () => ({
				url: "/users",
				method: "GET",
			}),
			providesTags: ["users"],
		}),
	}),
})

export const { useGetUsersQuery } = usersAPI
