import { request } from "@shared/api/request"
import { IUser } from "./types"

class UsersService {
	getUsers() {
		return request<IUser[]>("/users", { method: "GET" })
	}
}

export const usersService = new UsersService()
