import { request } from "@shared/api/request"
import { IUser } from "./types"

class UsersService {
	getUsers() {
		return request<IUser[]>("/users", { method: "GET" })
	}

	getUserById(id: string | number) {
		return request<IUser>(`/users/${id}`, { method: "GET" })
	}
}

export const usersService = new UsersService()
