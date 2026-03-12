import { request } from "@shared/api/request"
import { IUser } from "./types"

class UsersService {
	getUsers(search?: string) {
		const query = search ? `?search=${encodeURIComponent(search)}` : ""
		return request<IUser[]>(`/users${query}`, { method: "GET" })
	}

	getUserById(id: string | number) {
		return request<IUser>(`/users/${id}`, { method: "GET" })
	}
}

export const usersService = new UsersService()
