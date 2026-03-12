import { UsersList } from "@features/Users/ui/UsersList/UsersList"
import UsersListFilter from "@widgets/UsersListFilter/UsersListFilter"
import React, { useState } from "react"
import styles from "./UsersPage.module.scss"
import { useDebounce } from "@shared/hooks/useDebounce"

function UsersPage() {
	const [search, setSearch] = useState("")
	const [debouncedSearch, setDebouncedSearch] = useState("")

	const debounceSearch = useDebounce((value: string) => {
		setDebouncedSearch(value)
	}, 400)

	const onSearchChange = (value: string) => {
		setSearch(value)
		debounceSearch(value)
	}

	return (
		<div className={styles.page}>
			<div className={styles.header}>
				<h1 className={styles.title}>Users</h1>
				<p className={styles.subtitle}>Manage profiles, activity, and access.</p>
			</div>
			<div className={styles.toolbar}>
				<UsersListFilter value={search} onChange={onSearchChange} />
			</div>
			<div className={styles.panel}>
				<UsersList search={debouncedSearch.trim()} />
			</div>
		</div>
	)
}

export default UsersPage
