import { UsersList } from "@features/Users/ui/UsersList/UsersList"
import UsersListFilter from "@widgets/UsersListFilter/UsersListFilter"
import React from "react"

function UsersPage() {
	return (
		<div>
			<UsersListFilter />
			<UsersList />
		</div>
	)
}

export default UsersPage
